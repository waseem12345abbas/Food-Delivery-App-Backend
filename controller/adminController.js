const { calculateUserRanks } = require("./profileRank");
const { getTodayRevenue } = require("./analyticsController");

// Controller to trigger user rank update
const updateUserRanks = async (req, res) => {
  try {
    const result = await calculateUserRanks();
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(500).json({ message: result.message, error: result.error });
    }
  } catch (error) {
    console.error("Error in updateUserRanks controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get today's revenue
const getTodaysRevenue = async (req, res) => {
  try {
    await getTodayRevenue(req, res);
  } catch (error) {
    console.error("Error in getTodaysRevenue controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateUserRanks, getTodaysRevenue };
