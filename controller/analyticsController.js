const Order = require('../models/orders');
const Product = require('../models/products');

const getBestSellingProducts = async (req, res)=>{
    try {
        const bestSellers = await Order.aggregate([
            { $unwind: "$cartItems" },
            { $group: {
                _id: "$cartItems.itemID",
                totalQuanity: { $sum: "$cartItems.itemQuantity" },
                name: { $first: "$cartItems.itemName"}
            }
        },
        { $sort: { totalQuanity: -1 } },
        { $limit: 5 }
        ]);
        // populate full product details
        const populated = await Product.populate(bestSellers, { path: '_id' });
        return res.status(200).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { getBestSellingProducts };