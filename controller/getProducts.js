// mongoose model of products
const laptopProducts = require('../models/products');

const getProducts = async (req, res) => {
    try {
        const { category, brand, minPrice, maxPrice, condition, isSpecialDeal } = req.query;

        // Build filter object
        let filter = {};

        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = brand;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (condition) {
            filter.condition = condition;
        }
        if (isSpecialDeal !== undefined) {
            filter.isSpecialDeal = isSpecialDeal === 'true';
        }

        const products = await laptopProducts.find(filter).lean();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = getProducts;
