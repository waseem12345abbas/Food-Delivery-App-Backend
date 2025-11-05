const Order = require("../models/orders");

const createOrder = async (req, res) => {
  try {
    // create new order
    const { paymentId, userData, cartItems, address, payAtCounter, orderNumber, discountDetails } = req.body;

    // Check if required fields are present
    if (!cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: cartItems"
      });
    }

    let parsedCartItems;
    let parsedFormData = {};
    let parsedAddress = null;
    let parsedDiscountDetails = null;

    try {
      parsedCartItems = JSON.parse(cartItems);
      if (userData) {
        parsedFormData = JSON.parse(userData);
      }
      if(address){
        parsedAddress = JSON.parse(address);
      }
      if(discountDetails){
        parsedDiscountDetails = JSON.parse(discountDetails);
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

    // Filter out invalid cart items (null or missing id)
    const validCartItems = parsedCartItems.filter(item => item && item.id);

    // Check if there are any valid cart items
    if (validCartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid cart items provided"
      });
    }

    const newOrder = new Order({
      userID: parsedFormData.id || null,
      orderNumber: orderNumber,
      userName: parsedFormData.name || null,
      userEmail: parsedFormData.email || null,
      userCNIC: parsedFormData.cnic || null,
      cartItems: validCartItems.map((item)=>({
        itemID: item.id,
        itemName: item.name,
        itemQuantity: item.quantity,
        itemPrice: item.price,
      })),
      address: parsedAddress ? [{
        addrName: parsedAddress.name,
        addrPhone: parsedAddress.phone,
        addrEmail: parsedAddress.email,
        addrStreet: parsedAddress.street,
        addrCity: parsedAddress.city,
        addrState: parsedAddress.state,
        addrPostalCode: parsedAddress.postalCode,
        addrCountry: parsedAddress.country,
        addrDeliveryInstructions: parsedAddress.deliveryInstructions,
      }] : [],
      paymentId,
      proofImage: req.file ? {
        path: req.file.path,
        filename: req.file.filename,
        originalname: req.file.originalname
      } : null,
      orderAmount: parsedDiscountDetails ? parsedDiscountDetails.totalPrice : validCartItems.reduce((acc, item)=>{
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return acc + (price* quantity)
    }, 0),
      discountDetails: parsedDiscountDetails,
  })

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
