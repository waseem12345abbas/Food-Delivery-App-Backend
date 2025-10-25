const Order = require('../models/orders');

const getOrderById = async (req, res) => {
    try {
        const orderNumber = req.params.id;

        // Search by orderNumber field
        const order = await Order.findOne({ orderNumber: orderNumber });

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
