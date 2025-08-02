const express=require('express')
const router=express.Router();
const {getAllUsers,spamReports,blackListUser}=require('../controllers/Admin')
const {isAdmin,auth}=require('../middlewares/auth')


router.get('/users',auth,isAdmin,getAllUsers)
router.get('/spam-reports',auth,isAdmin,spamReports)
router.post('/ban',auth,isAdmin,blackListUser)



module.exports=router;