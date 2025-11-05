const Order = require('../models/orders');
const laptopProducts = require('../models/products');

const getTodayRevenue = async (req, res) => {
    try {
        // Get start of today (00:00:00)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Get end of today (23:59:59)
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const result = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    status: "Confirmed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$orderAmount" }
                }
            }
        ]);

        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

        return res.status(200).json({ success: true, totalRevenue });
    } catch (error) {
        console.error("Error calculating today's revenue:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getTodayRevenue };
