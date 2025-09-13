const mongoose=require('mongoose')
// get the schema
const Products=require('../models/products')
const Orders=require('../models/orders')
// get the data
const foodProducts=require('../data/products.json')
const orderData=require('../data/order.json')

// connect with database and store the products
mongoose.connect("mongodb://127.0.0.1:27017/sroms")
    .then( async ()=>{
        console.log("Connected successfully")

        const inserted=await Orders.insertMany(orderData.featureProducts)
        console.log(`Products ${inserted.length} successfully`)

        // const productsToDelete = await Products.find()
        //     .sort({ createdAt: 1}) // Sort by creation date ascending (oldest first)
        //     .limit(18)
        // if(productsToDelete.length === 0 ){
        //     console.log("No products found to delete");
        //     await mongoose.disconnect();
        //     console.log("🔌 Disconnected from MongoDB");
        //     return;
        // }
        // const productsIds = productsToDelete.map(product=> product._id);
        // const result =await Products.deleteMany({_id: {$in: productsIds}})
        // console.log("Products Deleted Successfully", result.deletedCount)
        //  // Optional: Show which products were deleted
        //         console.log("\nDeleted products:");
        //         productsToDelete.forEach((product, index) => {
        //             console.log(`${index + 1}. ${product.name} - ${product.category}`);
        //         });
                
                await mongoose.disconnect();
                console.log("🔌 Disconnected from MongoDB");
        await mongoose.disconnect();
         console.log("🔌 Disconnected from MongoDB");
    }).catch((error)=>{
        console.log(`Error while inserting the data`, error)
}) 