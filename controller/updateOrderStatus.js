const orders = require('../models/orders')
const { getIO } = require('../utils/socket')

const updateOrderStatus = async (req, res)=>{
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateStatus = await orders.findByIdAndUpdate(id, { status }, { new : true })
        if(!updateStatus){
            return res.status(404).json({message:'Order not found', status:false})
        }

        // Emit real-time update to the order room
        const io = getIO();
        io.to(id).emit('orderStatusUpdated', { orderId: id, status });

        return res.status(200).json({status:true, data:updateStatus, message:"Order updated successfully"})
    } catch (error) {
        return res.status(500).json({status:false, message:error||"Internal server error"})
    }
}

module.exports = updateOrderStatus
