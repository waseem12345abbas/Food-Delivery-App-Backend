const orderSchema = require('../models/orders')
const getOrder = async (req, res)=>{
    try {
        const { email:userEmail } = req.params;
        const orderData = await orderSchema.find({userEmail})
        if(orderData && orderData.length>0){
            return res.status(200).json({success:true, data:orderData})
        }
        return res.status(404).json({success:false, message:"No order found from this email."})
    } catch (error) {
        return res.status(500).json({success:false, message:error || "Internal server error"})
    }
}

module.exports = getOrder;