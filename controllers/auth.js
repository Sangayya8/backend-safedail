const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

exports.signUp=async (req,res) => {
    try {
        const {name,email,password,accountType}=req.body;
        // if user already exist
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'Email Already Exist'
            })
        }
        // secure the password
        let hasshedpassword;
        try {
            hasshedpassword=await bcrypt.hash(password,10);
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:"cannot hash password"
            })
        }
        // entry createing
        const user =await User.create({
            name,email,password:hasshedpassword,accountType
        })
        return res.status(200).json({
            success:true,
            data:user,
            message:'user created successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            error:error.message,
            message:"user cannot be registered"
        })
    }
}
exports.login=async (req,res) => {
    try {
        const {email,password}=req.body;

        // check if email and password is not empty
        if(!email||!password){
            return res.status(401).json({
                success:false,
                message:"please enter all the details"
            })
        }

        // check if user does had an account
        let userExist=await User.findOne({email});
        if(!userExist){
            return res.status(402).json({
                success:false,
                message:"please sign in first"
            });
        }

        // check if the password is correct or not
        if(await bcrypt.compare(password,userExist.password)){

            require('dotenv').config()

            const payload={
                email:email,
                id:userExist._id,
                accountType:userExist.accountType
            }
        
            // create a token
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            })
            userExist=userExist.toObject()
            userExist.token=token
            userExist.password=undefined;

            const option={
                expires:new Date(Date.now()+3*24*60*60*1000)
            }

            // create a cookie in response and send
            res.cookie('loginToken',token,option).status(200).json({
                success:true,
                userExist,
                message:'user logged in successfully'
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }


    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            error:error.message,
            message:"user cannot Login"
        })
    }
}