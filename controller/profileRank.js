const orders = require("../models/orders");
const User = require("../models/userRegister");

const calculateUserRanks = async () => {
  try {
    const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

    // Aggregate orders by userEmail for the current month
    const userRanks = await orders.aggregate([
      {
        $match: {
          createdAt: { $gte: startMonth, $lte: endMonth },
          status: { $in: ["Confirmed", "Processing"] }
        }
      },
      {
        $group: {
          _id: "$userEmail",
          totalSpent: { $sum: { $toDouble: "$orderAmount" } }
        }
      }
    ]);

    // Define rank thresholds and discounts
    const rankThresholds = [
      { rank: "Diamond", minSpent: 50000, discount: 20 },
      { rank: "Platinum", minSpent: 30000, discount: 15 },
      { rank: "Gold", minSpent: 20000, discount: 10 },
      { rank: "Silver", minSpent: 10000, discount: 5 },
      { rank: "NewBie", minSpent: 0, discount: 0 }
    ];

    // Update each user's rank and discount in the User model
    for (const userRank of userRanks) {
      const { _id: email, totalSpent } = userRank;
      let assignedRank = "NewBie";
      let assignedDiscount = 0;

      for (const threshold of rankThresholds) {
        if (totalSpent >= threshold.minSpent) {
          assignedRank = threshold.rank;
          assignedDiscount = threshold.discount;
          break;
        }
      }

      await User.findOneAndUpdate(
        { email },
        { rank: assignedRank, discount: assignedDiscount },
        { new: true }
      );
    }

    return { success: true, message: "User ranks updated successfully." };
  } catch (error) {
    console.error("Error updating user ranks:", error);
    return { success: false, message: "Failed to update user ranks.", error };
  }
};

module.exports = { calculateUserRanks };
