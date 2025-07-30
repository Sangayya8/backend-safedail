const express=require('express')
const router=express.Router();

const {getUserProfile,lookupFunc}=require('../controllers/profile')
const {auth}=require('../middlewares/auth');
const {editFunc}=require('../controllers/modify')
const {reportNumber, unReportNumber, getReportOfNumber}=require('../controllers/report')

router.get('/profile',getUserProfile)
router.put('/profile',auth,editFunc)
router.get('/lookup',lookupFunc)
router.post("/spam/report",reportNumber)
router.post('/spam/remove',unReportNumber)
router.get('/spam/reports/:number',getReportOfNumber)

module.exports=router;