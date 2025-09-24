const Order = require('../models/orders');

const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if this is a guest user ID (starts with "guest_")
        let order;
        if (id.startsWith('guest_')) {
            // For guest users, search by userID field
            order = await Order.findOne({ userID: id });
        } else {
            // For regular users, search by _id (ObjectId)
            order = await Order.findById(id);
        }

        if (order) {
            return res.status(200).json({ success: true, data: order });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = getOrderById;
