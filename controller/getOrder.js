const orderSchema = require('../models/orders')
const getOrder = async (req, res)=>{
    try {
        const email = req.params.email || req.params.userEmail;
        console.log("EEEEEEEEEEEEEEeeeeee = ", email)
        if(!email){
            return res.status(400).json({success:false, message:"Email is required"})
        }
        console.log("Fetching orders for email:", email);
        const { email:userEmail } = req.params;
        let query = { userEmail: userEmail };
        const orderData = await orderSchema.find(query).sort({ createdAt: -1 }).limit(1);
        console.log("OOOOOOOOOOOOOOOOOOOOOOOo = ", orderData)
        if(orderData && orderData.length>0){
            return res.status(200).json({success:true, data:orderData})
        }
        return res.status(404).json({success:false, message:"No order found with the provided details."})
    } catch (error) {
        return res.status(500).json({success:false, message:error || "Internal server error"})
    }
}

module.exports = getOrder;