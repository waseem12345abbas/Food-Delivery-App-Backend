// mongoose model of products
const Products=require('../models/products')
const getProducts= async(req, res)=>{
    try {
        const products = await Products.find({}).lean();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found ${products}` });
        }
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
}

module.exports=getProducts