const mongoose=require('mongoose')
// here it is creating schema for products 
const productSchema=new mongoose.Schema({
    name:String,
    description:String,
    category:String,
    subCategory:String,

    price:Number,
    discountPrice:Number,
    calories:Number,
    image:String,

    isVegetarian: Boolean,
    isAvailable: Boolean,

    isFeatured: Boolean,
    isTodaysDeal: Boolean,
    dealExpiresAt:Date,

    createdAt: Date,
    updatedAt: Date
})

// export the schema to use this to create products 
module.exports=mongoose.model('foodProducts', productSchema)