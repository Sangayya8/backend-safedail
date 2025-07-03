const mongoose= require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Seller","Customer"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AdditionalDetails",
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    },]
    

})
module.exports=mongoose.model('User',userSchema);