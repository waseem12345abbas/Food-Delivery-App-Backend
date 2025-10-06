const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
// now create the user registration schema
const userRegister = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  role: {type:String, enum:['user', 'admin'], default:'user'},
  rank: { type: String, enum: ['NewBie', 'Silver', 'Gold', 'Platinum', 'Diamond'], default: 'NewBie' },
  discount: { type: Number, default: 0 }, // discount percentage
},
{timestamps:true}
);

// hash the password to encrypt it from being stolen
userRegister.pre('save',async function(next){
    // only hash if password is new or modified
    if(!this.isModified('password')) return next();
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt)
    next()
})
// method for login to chech the password
userRegister.methods.matchPassword= function(enteredPw){
    return bcrypt.compare(enteredPw, this.password)
}

// now export the model
module.exports=mongoose.model('User', userRegister)
