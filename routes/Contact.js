const express=require('express')
const router=express.Router();

const {auth}=require('../middlewares/auth');
const {syncContacts,getAllContacts}=require('../controllers/Contacts')


router.post('/sync',auth,syncContacts)
router.get('/getAllContacts',auth,getAllContacts)


module.exports=router;