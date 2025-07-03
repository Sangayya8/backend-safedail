const mongoose=require('mongoose');
exports.DbConnect=()=>{
    require('dotenv').config();
    const db_Url=process.env.DB_URL;
    mongoose.connect(db_Url).then(()=>{
        console.log('Connection with db established successfully');
    }).catch((e)=>{
        console.log('cannnot esatblish connection with DB ');
        console.error(e);
        process.exit(1);
    })
}