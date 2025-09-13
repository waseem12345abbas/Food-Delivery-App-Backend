const express = require('express');
const router = express.Router();
const Safepay = require('@sfpy/node-core');

// Configure Safepay
const safepay = new Safepay("22d711c789780f8d0fe5328882d0f6359036ffd872a1a6d46846d04a8b1ad9f3", {
  authType: "secret",
  host: "https://sandbox.api.getsafepay.com",
});

// Create Safepay checkout
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { cartItems, formData } = req.body;
    if (!cartItems || !formData) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // ✅ Calculate total amount
    let amount = 0;
    cartItems.forEach(item => {
      amount += item.price * item.quantity;
    });

    // Safepay expects amount in paisa
    const amountInPaisa = amount * 100;

    // 1️⃣ Create payment session using the correct method
    const session = await safepay.payments.session.setup({
      amount: amountInPaisa,
      currency: "PKR",
      description: "Food Delivery Order",
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || "",
      },
    });

    if (!session || !session.data || !session.data.token) {
      return res.status(500).json({ error: "Failed to create Safepay session" });
    }

    const token = session.data.token;
    
    // 2️⃣ Generate checkout URL using Safepay's built-in method
    const checkoutUrl = safepay.checkout.createCheckoutUrl({
      env: "sandbox",
      token: token,
      redirect_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`
    });

    console.log("Safepay session created successfully");
    res.json({ checkoutUrl });

  } catch (error) {
    console.error('Safepay Error Details:', error);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

module.exports = router;
