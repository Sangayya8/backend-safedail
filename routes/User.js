const express=require('express')
const router=express.Router();

const {getUserProfile,lookupFunc}=require('../controllers/profile')
const {auth}=require('../middlewares/auth');
const {editFunc}=require('../controllers/modify')

router.get('/profile',getUserProfile)
router.put('/profile',auth,editFunc)
router.get('/lookup',lookupFunc)

module.exports=router;