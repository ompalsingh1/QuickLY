import express from 'express'
import mongoose  from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import helmet from 'helmet'
dotenv.config()

import userRouter from "./routes/user.route.js"
import categoryRouter from './routes/category.route.js';
import uploadRouter from './routes/upload.route.js';
import addressRouter from './routes/address.route.js';
import subcategoryRouter from './routes/subcategory.route.js';


const app = express();
app.use(cors({
credentials : true,
origin : process.env.FRONTEND_URL
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.)
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false 
}))

const port = process.env.port || 3000

app.get("/",(req,res) =>{
    res.json({
        message : "server is running"
    })
})

app.use("/api/user",userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/subcategory",subcategoryRouter)
app.use("/file",uploadRouter)
app.use("/api/address",addressRouter)

// connection with wongoose
await mongoose.connect(process.env.MONGODB_URI)
.then(()=> {
    console.log("connected to the mongoose database");

})
.catch (()=> {
    console.log("connection error")
});


app.listen(port,() => {
    console.log(`server is running in port ${port}`)
})