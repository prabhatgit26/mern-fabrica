import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//  Route for user login
const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message:"User doesn't exists."})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            
            const token = createToken(user._id)
            res.json({success:true, message:"User Logged In Successfully.", token})

        }
        else{
            res.json({success:false, message:"Invalid credentials."})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Route for user registration
const registerUser = async (req,res) => {
    try {
        
        const { name, email, password } = req.body;

        // checking user already exist or not
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message:"User already exists."})
        }
        
        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }

        if (password.length < 8) {
            return res.json({success:false, message:"Password must be 8 character or enter strong password."})
        }

        // Hashing user password for that generate salt function
        const salt = await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        })

        // new user stored in database
        const user = await newUser.save();

        // will provide/create token using that user can login in the application
        const token = createToken(user._id)

        res.json({success: true, message:"User Signed Up / Registered Successfully.", token})

    } catch (error) {
        console.log(error);

        res.json({success:false, message:error.message})
    }
}


// Route for admin login
const adminLogin = async (req,res) => {

}



export { loginUser, registerUser, adminLogin };