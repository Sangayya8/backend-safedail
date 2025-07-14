const mongoose= require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        // enum:["Seller","Customer"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AdditionalDetails",
    },
    lastContactSync: {
    type: Date,
    default: null,
  },

})
module.exports=mongoose.model('User',userSchema);