const Order = require("../models/orders");

const createOrder = async (req, res) => {
  try {
    // create new order
    const { paymentId, userData, cartItems, address } = req.body;

    // Check if required fields are present
    if (!paymentId || !cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: paymentId or cartItems"
      });
    }

    let parsedCartItems;
    let parsedFormData = {};
    let parsedAddress = null;

    try {
      parsedCartItems = JSON.parse(cartItems);
      if (userData) {
        parsedFormData = JSON.parse(userData);
      }
      if(address){
        parsedAddress = JSON.parse(address);
      }
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in cartItems or formData"
      });
    }

    // Validate that parsedCartItems is an array
    if (!Array.isArray(parsedCartItems)) {
      return res.status(400).json({
        success: false,
        message: "cartItems must be a valid array"
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
      address: parsedAddress?.map((addr)=>({
        addrName: addr.name,
        addrPhone: addr.phone,
        addrStreet: addr.street,
        addrCity: addr.city,
        addrPostalCode: addr.postalCode,
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
