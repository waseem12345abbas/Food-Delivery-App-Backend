const mongoose = require('mongoose');

// Schema for laptop products
const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    category: String,
    generation: String,
    processorType: String,
    processorSpeed: String,
    installedRAM: String,
    memoryType: String,
    hardDriveSize: String,
    hardDriveType: String,
    ssd: String,
    graphicSeries: String,
    dedicatedGraphics: String,
    graphicsMemory: String,
    graphicsProcessor: String,
    screenSize: String,
    screenResolution: String,
    screenType: String,
    color: String,
    operatingSystem: String,
    weight: String,
    keyboard: String,
    bluetooth: String,
    lan: String,
    wifi: String,
    usbPorts: String,
    hdmi: String,
    camera: String,
    warranty: String,
    price: Number,
    images: [String],
    condition: String,
    productPage: String,
    description: String,
    isSpecialDeal: Boolean,
    quantity: Number,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Export the schema to use this to create laptop products
module.exports = mongoose.model('laptopProducts', productSchema);
