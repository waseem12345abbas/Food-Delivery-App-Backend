const Order = require('../models/orders');

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            return res.status(200).json(order);
        } else {
            return res.status(404).json({ message: 'Order not found' });
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
