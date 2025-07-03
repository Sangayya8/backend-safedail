const User=require('../models/User')
const jwt=require('jsonwebtoken')
require('dotenv').config();

// auth
exports.auth=async (req,res,next) => {
    try {
        // extract the token
        const token=req.cookie.token||req.header('Authorization').replace('Bearer ',"")|| req.body.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token missing"
            })
        }
        // verify the token 
        try {
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=payload
        } catch (error) {
           return res.status(401).json({
                success:fasle,
                message:'token invalid'
            })
        }
        next();

    } catch (error) {
        console.error(error.message)    

        res.status(500).json({
        success:false,
        message:'something went wrong while verifying token'})
    }
}
// isAdmin
exports.isAdmin=async (req,res,next) => {
    try {
        if(req.user.accountType !== "Seller" ){
            return res.status(401).json({
            success:false,
            message:"Protected Route for Only Admins"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in authenticating Admin "+error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
// isFarmer
// exports.isFarmer=async (req,res,next) => {
//     try {
//         if(req.user.accountType !== "Farmer" ){
//             return res.status(401).json({
//             success:false,
//             message:"Protected Route for Only Farmers"
//             })
//         }
//         next();
        
//     } catch (error) {
//         console.log("error in authenticating Farmer "+error);
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }
// isCustomer
exports.isCustomer=async (req,res,next) => {
    try {
        if(req.user.accountType !== "Customer" ){
            return res.status(401).json({
            success:false,
            message:"Protected Route for Only Customers"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in authenticating Customer "+error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}