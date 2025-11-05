const laptopProducts = require('../models/products');

// find the related products
const searchById=('/products', async(req, res)=>{
    const id= req.params.id;
    try {
        const idProduct = await laptopProducts.findById(id).lean();
        if(idProduct){
            return res.status(200).json(idProduct) 
        }else{
           return res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
         console.error('Database error:', error);
      res.status(500).json({ 
      success: false,
      message: error.message 
    });
    }
})

module.exports=searchById