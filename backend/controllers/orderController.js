import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";


// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing orders using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save(); // using this order will save to database

        await orderModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({success:true, message:"Order Placed Successfully"})
        

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
    
}

// // placing orders using Stripe method
// const placeOrderStripe = async (req, res) => {
//     try {

//         const { userId, items, amount, address } = req.body;
//         const { origin } = req.headers.origin || 'http://localhost:5173'; 
//         console.log("origin url :", origin)

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod:"Stripe",
//             payment:false,
//             date:Date.now()
//         }
        
//         const newOrder = new orderModel(orderData)
//         await newOrder.save(); // using this order will save to database

//         const line_items = items.map((item) => ({
//             price_data : {
//                 currency : currency,
//                 product_data : {
//                     name: item.name
//                 },
//                 unit_amount : item.price * 100
//             },
//             quantity : item.quantity
//         }))

//         line_items.push({
//             price_data : {
//                 currency : currency,
//                 product_data : {
//                     name: 'Delivery Charges'
//                 },
//                 unit_amount : deliveryCharge * 100
//             },
//             quantity : 1
//         })

//         // create new session
//         const session = await stripe.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//             line_items,
//             mode: 'payment',
            

//         })
//             console.log("Success URL:", `${origin}/verify?success=true&orderId=${newOrder._id}`);
//             console.log("Cancel URL:", `${origin}/verify?success=false&orderId=${newOrder._id}`);
//         res.json({success:true, session_url:session.url});

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message});
        
//     }
    
// }


// // Verify stripe
// const verifyStripe = async (req, res) => {
//     const { userId, orderId, success } = req.body
//     try {
//         if (success === "true") {
//             await orderModel.findByIdAndUpdate(orderId, {payment:true});
//             await userModel.findByIdAndUpdate(userId, {cartData:{}})
//             res.json({success:true});
//         }else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false})
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message});
//     }
// }



// placing orders using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin || 'http://localhost:5173'; // Fallback to your frontend URL
        console.log("Origin URL:", origin);

        console.log("User ID:", userId);

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        console.log("Order Data:", orderData);
        
        const newOrder = new orderModel(orderData);
        await newOrder.save(); // Save the order to the database

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        // Create new session
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        console.log("Session Details:", session);
        
        // Respond with the session URL
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify stripe
const verifyStripe = async (req, res) => {
    const { userId, orderId, success } = req.body;
    console.log("Verification Data:", { userId, orderId, success });

    try {
        if (success === "true") {
            // Update the order to mark it as paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Clear the cart data after successful payment
            //await userModel.findByIdAndUpdate(userId, { cartData: {} });
            await userModel.findByIdAndUpdate(userId, {cartDatya:{}} )

            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};





// placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {
    
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {

    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders});
         
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
    

}

// All Orders data for frontend 
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body;

        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status })

        res.json({success:true, message:'Status Updated'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe };