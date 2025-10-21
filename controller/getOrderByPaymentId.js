const Order = require('../models/orders');

const getOrderByPaymentId = async (req, res) => {
    try {
        const order = await Order.findOne({ paymentId: req.params.paymentId });
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

module.exports = getOrderByPaymentId;
