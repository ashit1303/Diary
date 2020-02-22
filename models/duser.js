//USER DATA SCHEMA IN MONGOOSE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newUser= new Schema({
  dpdet: { name: {type:String,default:'imagenotfound.png'}, mimetype:String },
  name:String,
  email:{ type: String, lowercase: true },
  password: {type: String, required: true},
  dob:Date,
  gender: {type: String, enum: ['Male', 'Female', 'Others'] }, 
  doj:{type:Date, default:Date.now},
  mobile:{type:Number, min:1111111111,max:9999999999},
  isVerified:Boolean,
  otp:String
    
})


module.exports=mongoose.model('users',newUser);  
