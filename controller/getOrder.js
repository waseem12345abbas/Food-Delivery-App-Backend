const orderSchema = require('../models/orders')
const getOrder = async (req, res)=>{
    try {
        const identifier = req.params.email;
        console.log("Fetching orders for identifier:", identifier)
        if(!identifier){
            return res.status(400).json({success:false, message:"Identifier is required"})
        }
        let query;
        if (identifier.includes('@')) {
            // It's an email
            query = { userEmail: identifier };
        } else {
            // It's a userID
            query = { userID: identifier };
        }
        const orderData = await orderSchema.find(query).sort({ createdAt: -1 });
        console.log("Found orders:", orderData.length, "for identifier:", identifier)
        if(orderData && orderData.length>0){
            return res.status(200).json({success:true, data:orderData})
        }
        return res.status(404).json({success:false, message:"No order found with the provided details."})
    } catch (error) {
        console.error("Error fetching orders:", error)
        return res.status(500).json({success:false, message:error || "Internal server error"})
    }
}

module.exports = getOrder;