const mongoose= require("mongoose");

// create order schema using mongoose
//   { id:order._id, name:order.name, quantity:order.quantity, price:order.price}
const orderSchema = new mongoose.Schema({
   userID: String,
   orderNumber: String,
   serviceType: String,
   userName: String,
   userEmail: String,
   userCNIC: String,
   cartItems:[
    {
        itemID: String,
        itemName: String,
        itemQuantity: Number,
        itemPrice: Number,
    },
   ],
   address:[
    {
        addrName: String,
        addrPhone: String,
        addrStreet: String,
        addrCity: String,
        addrPostalCode: String,
    },
   ],
   comment: String,
   paymentId: String,
   proofImage: String,
   orderAmount: Number,
   discountDetails: {
    userRank: String,
    discountPercentage: Number,
    discountAmount: Number,
    discountedSubtotal: Number,
    totalPrice: Number,
   },
   status:{
    type: String,
    enum:["Pending", "Confirmed", "Rejected"],
    default: "Pending",
   },
   stages: [
    {
      id: Number,
      name: String,
      duration: Number, // in minutes
      completed: { type: Boolean, default: false },
      image: String,
      updatedAt: { type: Date, default: Date.now }
    }
   ],
   timer: {
    startTime: Date,
    endTime: Date
   },
    clientRatingFood:String,
    clientRatingDelivery:String,
   riderDetails: {
    riderName: String,
    riderNumber:String,
    riderLocation:String,
   },
   createdAt: {
    type: Date,
    default: Date.now,
   },
})

module.exports = mongoose.model("Order", orderSchema);