// update rating from user
const Order = require("../models/orders")

const clientRating = async(req, res)=>{
    try {
        const {id} = await req.params;
        console.log("Order id ", id)
        const  clientRatingFood = await req.body.clientRatingFood;
        const clientRatingDelivery = await req.body.clientRatingDelivery
        // find order by order id
        const order = await Order.findById(id)
        if(!order){
            console.log({success:false, message:"NO Order found", order})
            res.status(404).json({success:false, message:"NO Order found"})
            return
        }
        if(clientRatingFood) order.clientRatingFood = clientRatingFood;
        if(clientRatingDelivery) order.clientRatingDelivery = clientRatingDelivery

        // now save this data in the order 
        await order.save()
        // response the user that order saved successfully
        return res.status(200).json({
            success:true,
            message:"Rating saved successfully.",
            data:order
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Server error while saving the rating = ${error}`
        })
    }
}

module.exports = clientRating