import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding bulk products
const addBulkProducts = async (req, res) => {
    try {
        // Extract products array from the request body
        const productsArray = req.body.products; // assuming you send data as { products: [...] }
        
        // Check if it's an array and has products
        if (!Array.isArray(productsArray) || productsArray.length === 0) {
            return res.status(400).json({ success: false, message: "No products found in request" });
        }

        // Iterate over each product in the productsArray
        let allProductData = await Promise.all(
            productsArray.map(async (product) => {
                const { name, description, price, category, subCategory, sizes, bestseller, files } = product;

                // Extract image files (assuming they're sent along with product data)
                const image1 = files?.image1 && files.image1[0];
                const image2 = files?.image2 && files.image2[0];
                const image3 = files?.image3 && files.image3[0];
                const image4 = files?.image4 && files.image4[0];

                // Save images in an array
                const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

                // Upload images to Cloudinary
                let imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url;
                    })
                );

                // Create product data for each item
                const productData = {
                    name,
                    description,
                    category,
                    price: Number(price),
                    subCategory,
                    bestseller: bestseller === "true", // Convert string to boolean
                    sizes: JSON.parse(sizes), // Assuming sizes are sent as a JSON string
                    image: imagesUrl,
                    date: Date.now(),
                };

                // Return product data for bulk saving later
                return productData;
            })
        );

        // Insert all products into the database in bulk
        const products = await productModel.insertMany(allProductData);

        // Response after successful bulk addition
        res.json({ success: true, message: "All Products Added Successfully.", products });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error);
    }
};






// Function for add product
const addProduct = async (req,res) => {
    try {
        
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        // saved images in images array 
        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

        // upload images on URL (from cloudinary)
        let imagesUrl = await Promise.all(
            images.map(async (item) =>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url
            })
        )

        // 
        const productdata = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes), //sizes in form of array and array can't access in form data so we use JSON.parse here
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productdata);


        const product = new productModel(productdata);
        await product.save()

        res.json({success:true, message:"Product Added Successfully."})

        // res.json({})

    } catch (error) {
        res.json({success:false, message:error.message})
        console.log(error);
    }

}

// Function for list product
const listProducts = async (req,res) => {

    try {
        
        const products = await productModel.find({});
        res.json({success:true, products}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

// Function for removing product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product Removed Successfully."})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})

    }

}

// Function for single product info
const singleProduct = async (req,res) => {
    try {

        const { productId } =req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }

}

export { addBulkProducts,listProducts, addProduct, removeProduct, singleProduct };