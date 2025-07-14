const express=require('express');
const app=express();
const cookieParser = require("cookie-parser");
app.use(express.json());

require('dotenv').config();
const port=process.env.PORT;

app.use(cookieParser())

// importing routes and mounting 
const routes=require('./routes/Routes')
const userRoutes=require('./routes/User')
const contactRoutes=require('./routes/Contact')



app.use('/api/v1',routes);
app.use('/api/v1/user',userRoutes)
app.use("/api/v1/contacts",contactRoutes)

// activate 
app.listen(port,()=>{
    console.log(`App is running on port no. ${port}`);
})
app.get('/',(req,res)=>{
    res.send("This is Home page");
})
// connection with DB
const {DbConnect}=require('./config/databse')
DbConnect();