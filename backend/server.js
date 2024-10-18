import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from "./routes/productRoute.js";
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();        // calling connectDB() function
connectCloudinary();    // calling connectCloudinary() function

// Create Middlewares
app.use(express.json())
app.use(cors())

// API Endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req,res)=>{
    res.send("API is Working Properly || The API is active and functioning as expected.");
})


app.listen(port, ()=> console.log("\nServer Started on PORT : "+ port));


