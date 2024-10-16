import express from "express";
import { addBulkProducts, addProduct, listProducts, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router()  // using this Router will create GET & POST method

productRouter.post('/addbulk',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addBulkProducts);
productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addProduct);
productRouter.post('/single',adminAuth, singleProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.get('/list', listProducts);

export default productRouter;