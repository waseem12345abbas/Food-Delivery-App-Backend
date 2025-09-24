const mongoose= require("mongoose");

// create order schema using mongoose
//   { id:order._id, name:order.name, quantity:order.quantity, price:order.price}
const orderSchema = new mongoose.Schema({
   userID: String,
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
   paymentId: String,
   proofImage: String,
   status:{
    type: String,
    enum:["Pending", "Confirmed", "Rejected"],
    default: "Pending",
   },
   stages: [
    {
      name: String,
      completed: { type: Boolean, default: false },
      image: String,
      updatedAt: { type: Date, default: Date.now }
    }
   ],
   timer: {
    startTime: Date,
    endTime: Date
   },
   createdAt: {
    type: Date,
    default: Date.now,
   },
})

module.exports = mongoose.model("Order", orderSchema);