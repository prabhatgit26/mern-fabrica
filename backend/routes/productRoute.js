import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from "../controllers/productController.js";

const productRouter = express.Router()  // using this Router will create GET & POST method

productRouter.post('/add', addProduct);
productRouter.post('/single', singleProduct);
productRouter.post('/remove', removeProduct);
productRouter.get('/list', listProducts);

export default productRouter;