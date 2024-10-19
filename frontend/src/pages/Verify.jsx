import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
    const {token, setCartItems, backendUrl} = useContext(ShopContext)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Add loading state

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const storedToken = localStorage.getItem('token');
    console.log('Token from local storage:', storedToken); // Log token from local storage

    if (!token) {
        console.log('Current token from context:', token); // Log token from context
    }

    const verifyPayment = async () => {
        try {
            console.log('Current token:', storedToken);
            if (!storedToken) {
                // Handle case where token is missing
                toast.error('User not authenticated');
                navigate('/login'); // Redirect to login or appropriate page
                return;
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: {token: storedToken } });
            console.log('Response from server:', response.data.success); // Log the response data

            if (response.data.success) {
                setCartItems({});
                toast.success('Payment verified successfully!');
                 navigate('/orders');
            } else {
                toast.error('Payment verification failed.');
                 navigate('/cart');
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false); // Update loading state
        }
    };

    useEffect(() => {
        if (storedToken) {
            verifyPayment();
        }
        
    }, [storedToken]); // Verify payment on mount or when token changes

    return (
        <div>
            {loading ? (
                <h2>Verifying payment...</h2> // Show loading message
            ) : (
                <h2>Verification complete!</h2>
            )}
        </div>
    );
};

export default Verify;


// -----------------------------------------------------------------------------------------------
// import React, { useContext, useEffect } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Verify = () => {
//   const { token, setCartItems, backendUrl } = useContext(ShopContext);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const success = searchParams.get("success");
//   const orderId = searchParams.get("orderId");

//   const verifyPayment = async () => {
//     try {
//       if (!token) {
//         // Handle case where token is missing
//         toast.error('User not authenticated');
//         navigate('/login'); // Redirect to login or appropriate page
//         return;
//       }

//       const response = await axios.post(
//         backendUrl + '/api/order/verifyStripe',
//         { success, orderId },
//         { headers: { token } }
//       );
//       console.log('Response from server:', response.data.success); // Log the response data
//       if (response.data.success) {
//         setCartItems({});
//         toast.success('Payment verified successfully!');
//         navigate("/orders");
//       } else {
//         toast.error('Payment verification failed.');
//         navigate("/cart");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     verifyPayment();
//   }, [token]);

//   return <div>
//     verify
//   </div>;
// };

// export default Verify;


