const express=require('express')
const router=express.Router();

// importing routes
const {login,signUp}=require("../controllers/auth")
const {auth}=require('../middlewares/auth');
const { editFunc, deleteFunc } = require('../controllers/modify');

router.post('/login',login)
router.post('/signUp',signUp)
router.post('/home',auth,(req,res)=>{
    res.status(200).json({
        success:true,
        messag:"welcome to home "
    })
})
router.put('/update',editFunc)
router.delete('/deleteUser',deleteFunc)

module.exports=router;