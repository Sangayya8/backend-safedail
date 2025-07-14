const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.getUserProfile=async (req,res)=>{
   try {
     const token =
      req.cookies?.loginToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user=await User.findById(decode.id).populate("additionalDetails").exec();
    user.password=undefined
    return res.status(200).json({
        success:true,
        user
    })

   } catch (error) {
    console.log("Error in getting user details");
    res.status(401).json({
        success:false,
        message:error.message
    })
   }
}