const Order = require('../models/orders');
const { notifyOrderUpdate } = require("../server.js");

const updateOrder= async (req, res) =>{
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      // Replace stages with provided stages
      if (req.body.stages !== undefined) {
        order.stages = req.body.stages;
      }
      // Update timer if provided
      if (req.body.timer) {
        order.timer = req.body.timer;
      }
      await order.save();
    // notify users in socket room
    // notifyOrderUpdate(order._id.toString(), order); // commented out due to circular dependency
    res.json(order);
    } catch (error) {
         res.status(500).json({ error: "Update failed" });
    }
}

module.exports = updateOrder;
