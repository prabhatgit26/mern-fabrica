import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connect } from 'http2';
import connectDB from './config/mongodb.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Create Middlewares
app.use(express.json())
app.use(cors())

// API Endpoints
app.get('/', (req,res)=>{
    res.send("API is Working..!");
})


app.listen(port, ()=> console.log("\nServer Started on PORT : "+ port));