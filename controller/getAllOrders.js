const Order = require('../models/orders')

const getAllOrders = async(req, res)=>{
    try {
        const allOrders = await Order.find({}).populate('userID', 'name email').populate('cartItems.itemID', 'name price').lean();
        if(allOrders && allOrders.length>0){
            return res.status(200).json({success:true, data:allOrders})
        }else{
            return res.status(404).json({success:false, message:"No Order found."})
        }
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports = getAllOrders
