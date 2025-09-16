const Order = require("../models/orders");

const createOrder = async (req, res) => {
  try {
    // create new order
    const { paymentId, formData, cartItems } = req.body;

    // Check if required fields are present
    if (!paymentId || !cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: paymentId or cartItems"
      });
    }

    let parsedCartItems;
    let parsedFormData = {};

    try {
      parsedCartItems = JSON.parse(cartItems);
      if (formData) {
        parsedFormData = JSON.parse(formData);
      }
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in cartItems or formData"
      });
    }

    const newOrder = new Order({
      userID: parsedFormData._id || null,
      userName: parsedFormData.name || null,
      userEmail: parsedFormData.email || null,
      userCNIC: parsedFormData.cnic || null,
      cartItems: parsedCartItems.map((item)=>({
        itemID: item.id,
        itemName: item.name,
        itemQuantity: item.quantity,
        itemPrice: item.price,
      })),
      paymentId,
      proofImage: req.file ? req.file.filename : null
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({ success: true, message:"Ordered Saved SUccessfully", data: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createOrder };
