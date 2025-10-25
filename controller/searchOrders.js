const ordersSchema = require('../models/orders')

const searchOrders = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {};

        if (search) {
            query = {
                $or: [
                    { status: { $regex: search, $options: 'i' } },
                    { userName: { $regex: search, $options: 'i' } },
                    { userEmail: { $regex: search, $options: 'i' } },
                    { _id: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const orders = await ordersSchema.find(query).sort({ createdAt: -1 });

        if (orders && orders.length > 0) {
            return res.status(200).json({ success: true, data: orders });
        } else {
            return res.status(404).json({ success: false, message: "No orders found matching the criteria." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = searchOrders
