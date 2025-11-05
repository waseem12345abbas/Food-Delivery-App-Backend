const laptopProducts = require('../models/products');

const addProduct = async (req, res) => {
    try {
        const {
            name, brand, category, generation, processorType, processorSpeed,
            installedRAM, memoryType, hardDriveSize, hardDriveType, ssd,
            graphicSeries, dedicatedGraphics, graphicsMemory, graphicsProcessor,
            screenSize, screenResolution, screenType, color, operatingSystem,
            weight, keyboard, bluetooth, lan, wifi, usbPorts, hdmi, camera,
            warranty, price, images, condition, productPage, description,
            isSpecialDeal, quantity, createdAt, updatedAt
        } = req.body;

        const addItem = new laptopProducts({
            name, brand, category, generation, processorType, processorSpeed,
            installedRAM, memoryType, hardDriveSize, hardDriveType, ssd,
            graphicSeries, dedicatedGraphics, graphicsMemory, graphicsProcessor,
            screenSize, screenResolution, screenType, color, operatingSystem,
            weight, keyboard, bluetooth, lan, wifi, usbPorts, hdmi, camera,
            warranty, price, images, condition, productPage, description,
            isSpecialDeal, quantity, createdAt, updatedAt
        });

        try {
            await addItem.save();
            res.status(200).json({ success: true, message: 'Product added successfully.' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error while saving the product.' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = addProduct;
