import jwt from "jsonwebtoken";

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers   //using this admin user need to send token in header to login it means need to send token in headers while login
        if (!token) {
            return res.json({success:false, message: "Not an Authorized User Login Again"})
        }

        //if token is available, we will decode token and will get string stored in variable
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false, message:"Not an Authorized User Login Again"})
        }
        next()  //calling callback function
        


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export default adminAuth;