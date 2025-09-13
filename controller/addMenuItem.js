const foodProducts=require('../models/products')

const addMenuItem= async(req, res)=>{
    try {
        const {
            name,description, price, discountPrice, category, subCategory, 
            calories, isVegetarian, isAvailable,   isFeatured, isTodaysDeal,
            dealExpiresAt, rating, createdAt, updatedAt , image}=req.body

            const addItem= new foodProducts({ name,description, price, discountPrice, category, subCategory, 
            calories, isVegetarian, isAvailable,   isFeatured, isTodaysDeal,
            dealExpiresAt, rating, createdAt, updatedAt , image})
            try {
                await addItem.save()
                res.status(200).json({success:true, message:'Item added successfully.'})
            } catch (error) {
                res.status(400).json({ success:false, message:'Error while saving the item.'})
            }

    } catch (error) {
        res.status(500).json({success:false, message:'Internal Server Error '})
    }
}

module.exports=addMenuItem