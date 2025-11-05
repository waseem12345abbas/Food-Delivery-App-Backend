const Order = require('../models/orders');

const updateOrder= async (req, res) =>{
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      // Replace stages with provided stages
      if (req.body.stages !== undefined) {
        order.stages = req.body.stages;
        order.trackStatus = true; // Set trackStatus to true when stages are added
      }
      // Update timer if provided
      if (req.body.timer) {
        order.timer = req.body.timer;
        order.trackStatus = true; // Set trackStatus to true when timer is added
      }
      // if rider details are given then update the order
      if(req.body.riderDetails){
        order.riderDetails=req.body.riderDetails
      }
      await order.save();
    // notify users in socket room
    const io = require('../utils/socket').getIO();
    io.to(order._id.toString()).emit('orderUpdated', order);
    res.json(order);
    } catch (error) {
         res.status(500).json({ error: "Update failed" });
    }
}

module.exports = updateOrder;
