// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const router = express.Router();

// Manual webhook signature verification function
function verifyWebhookSignature(payload, signature, secret) {
  try {
    // Safepay uses HMAC-SHA256 for webhook signature verification
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

// Safepay webhook endpoint
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // raw body for signature verification
  (req, res) => {
    try {
      const signature = req.headers["x-sfpy-signature"]; // Safepay signature header
      const payload = req.body.toString(); // Convert buffer to string
      
      // Verify webhook signature manually
      const isValid = verifyWebhookSignature(
        payload,
        signature,
        process.env.SAFEPAY_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error("⚠️ Invalid webhook signature");
        return res.sendStatus(400);
      }

      // Parse the webhook payload
      const event = JSON.parse(payload);

      console.log("Webhook received:", event);

      // Handle different events
      if (event.type === "payment.success") {
        // Update order as paid
        console.log("✅ Payment success:", event.data);
      } else if (event.type === "payment.failed") {
        console.log("❌ Payment failed:", event.data);
      } else if (event.type === "payment.refunded") {
        console.log("🔄 Payment refunded:", event.data);
      } else if (event.type === "payment.disputed") {
        console.log("⚖️ Payment disputed:", event.data);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("⚠️ Webhook error:", err.message);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
