import jwt from 'jsonwebtoken';

const authUser = async (req,res,next) => {

    const { token } = req.headers;
    console.log(JSON.stringify(req.headers))
    console.log("token : ",token);
        
    if (!token) {
        return res.json({success: false, message: "Not an Authorized User, Login again"});
       
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token decode : ",token_decode);
        req.body.userId = token_decode.id
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

export default authUser;


//---------------------------------------------------------------------------------------------------------------


// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//     // Extract the Authorization header
//     const authorizationHeader = req.headers.token;
//     console.log(JSON.stringify(req.headers));

//     // Check if the Authorization header is missing
//     if (!authorizationHeader) {
//         return res.json({ success: false, message: "Not an Authorized User, Login again" });
//     }

//     // Extract the token from the Authorization header
//     const token = authorizationHeader

//     if (!token) {
//         return res.json({ success: false, message: "Token is missing, Login again" });
//     }

//     try {
//         // Verify the token using the secret key
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         // Attach the user ID to the request body for further processing
//         req.body.userId = token_decode.id;
//         // Proceed to the next middleware or route handler
//         next();
//     } catch (error) {
//         console.log("Token Verification Error:", error);
//         // Send a response indicating the token verification failed
//         res.json({ success: false, message: "Token verification failed, Login again" });
//     }
// };

// export default authUser;
