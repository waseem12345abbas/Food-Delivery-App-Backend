const Order = require("../models/orders");
const { defaultStages } = require("../utils/stages");

const createOrder = async (req, res) => {
  try {
    // create new order
    const { paymentId, userData, cartItems, address, payAtCounter, comment } = req.body;

    // Check if required fields are present
    if (!cartItems) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: cartItems"
      });
    }

    // For online payment, require paymentId
    if (!payAtCounter && !paymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing paymentId for online payment"
      });
    }

    let parsedCartItems;
    let parsedFormData = {};
    let parsedAddress = null;

    try {
      parsedCartItems = JSON.parse(cartItems);
      if (userData) {
        parsedFormData = JSON.parse(userData);
        console.log("UUUUUUUUUUUUUUUUUUUU = ", parsedFormData)
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

    // Calculate total time based on stages
    const totalDuration = defaultStages.reduce((acc, stage) => acc + stage.recommendedPercent, 0);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000); // totalDuration in minutes

    // Create stages with durations
    const stages = defaultStages.map(stage => ({
      id: stage.id,
      name: stage.name,
      duration: stage.recommendedPercent, // in minutes
      completed: false,
      image: stage.icon,
      updatedAt: startTime
    }));

    const newOrder = new Order({
      userID: parsedFormData.id || null,
      userName: parsedFormData.name || null,
      userEmail: parsedFormData.email || null,
      userCNIC: parsedFormData.cnic || null,
      cartItems: parsedCartItems.map((item)=>({
        itemID: item.id,
        itemName: item.name,
        itemQuantity: item.quantity,
        itemPrice: item.price,
      })),
      address: parsedAddress ? [{
        addrName: parsedAddress.name,
        addrPhone: parsedAddress.phone,
        addrStreet: parsedAddress.street,
        addrCity: parsedAddress.city,
      }] : [],
      comment: comment || "",
      paymentId,
      proofImage: req.file ? req.file.filename : null,
      orderAmount:parsedCartItems.reduce((acc, item)=>{
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return acc + (price* quantity)
    }, 0),
      stages: stages,
      timer: {
        startTime: startTime,
        endTime: endTime
      }
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
