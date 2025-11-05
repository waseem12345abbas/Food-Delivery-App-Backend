const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderNumber: String,
  userName: String,
  userEmail: String,
  userCNIC: String,
  cartItems: [{
    itemID: { type: mongoose.Schema.Types.ObjectId, ref: 'laptopProducts' },
    itemName: String,
    itemQuantity: Number,
    itemPrice: Number,
  }],
  address: [{
    addrName: String,
    addrPhone: String,
    addrEmail: String,
    addrStreet: String,
    addrCity: String,
    addrState: String,
    addrPostalCode: String,
    addrCountry: String,
    addrDeliveryInstructions: String,
  }],
  paymentId: String,
  proofImage: {
    path: String,
    filename: String,
    originalname: String
  },
  orderAmount: Number,
  discountDetails: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
