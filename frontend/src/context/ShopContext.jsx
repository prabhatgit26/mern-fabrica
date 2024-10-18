import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // Add item to the cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token}});


            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }


    };

    // Get total count of items in the cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    // // Update quantity of items in the cart
    // const updateQuantity = async (itemId, size, quantity) => {

    //     let cartData = structuredClone(cartItems);
        
    //     cartData[itemId][size] = quantity;
        
    //     setCartItems(cartData);

    //     if (token) {
    //         try {
    //             await axios.post(backendUrl + '/api/cart/update', {itemId, size}, {headers:{token}})


    //         } catch (error) {
    //             console.log(error);
    //             toast.error(error.message);
    //         }
    //     }

    // };

    // Update quantity of items in the cart
    const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    
    // Update the local cart data
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    // If the user is logged in (token exists), update the backend as well
    if (token) {
        try {
            // Make the API call to update the cart in the database
            const response = await axios.post(`${backendUrl}/api/cart/update`, 
                { itemId, size, quantity }, // Include quantity in the request payload
                { headers: { token } }
            );

            if (response.data.success) {
                // Optionally show a success message
                toast.success("Cart updated successfully");
            } else {
                // Handle the case where the backend didn't update successfully
                toast.error(response.data.message || "Failed to update cart");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while updating the cart");
        }
    }
};




    // Get total amount of the items in the cart
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                    
                    
                }
            }
        }
        return totalAmount;
    };

    // Fetch products from the API
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
                
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Logout function
    const logout = () => {
        setToken(""); // Clear the token from state
        localStorage.removeItem("token"); // Remove token from local storage
        setCartItems({}); // Clear the cart items
        toast.success("Logged out successfully");
    };

    const getUserCart = async (token) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    // Fetch products when the component mounts
    useEffect(() => {
        getProductsData();
    }, []);

    // Check for existing token in local storage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
            
        }
    }, []);

    // Navigate to login page if token is cleared
    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true }); // Navigate to the login page
        }
    }, [token, navigate]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity, backendUrl,
        token, setToken, logout, getCartAmount, getProductsData, setCartItems, navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;



























// import { createContext, useEffect, useState } from "react";
// // import { products } from "../assets/assets";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {

//     const currency = '$';
//     const delivery_fee = 10;
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;
//     const [search, setSearch] = useState('');
//     const [showSearch, setShowSearch] = useState(false);
//     const [cartItems, setCartItems] = useState({});
//     const [products, setProducts] = useState([]);
//     const [token, setToken] = useState('');
//     const navigate = useNavigate();


//      // creating function add to cart
//      const addToCart = async (itemId, size) => {

//         if (!size) {
//             toast.error('Select Product size');
//             return;
//         }

//         let cartData = structuredClone(cartItems);

//         if (cartData[itemId]) {
//             if (cartData[itemId][size]) {
//                 cartData[itemId][size] += 1;
//             }
//             else{
//                 cartData[itemId][size] = 1;
//             }
//         }
//         else{
//             cartData[itemId] = {};
//             cartData[itemId][size] = 1;
//         }

//         setCartItems(cartData);

//     }


//     const getCartCount = () => {
//         let totalCount = 0;
//         for(const items in cartItems){
//             for(const item in cartItems[items]){
//                 try {
//                     if (cartItems[items][item] > 0) {
//                         totalCount += cartItems[items][item];
//                     }
//                 } catch (error) {
                    
//                 }
//             }
//         }
//         return totalCount;
//     }


//     const updateQuantity = async (itemId, size, quantity)=>{

//         let cartData = structuredClone(cartItems);

//         cartData[itemId][size] = quantity;

//         setCartItems(cartData);



//     }


//     const getCartAmount =  () => {
//         let totalAmount = 0;
//         for(const items in cartItems){
//             let itemInfo = products.find((product)=> product._id === items);
//             for(const item in cartItems[items]){
//                 try {
//                     if (cartItems[items][item] > 0) {
//                         totalAmount += itemInfo.price * cartItems[items][item];
//                     }
//                 } catch (error) {
                    
//                 }
//             }
//         }
//         return totalAmount;
//     }

//     //get products from api
//     const getProductsData = async () => {
//         try {
//             console.log("Requesting URL:", backendUrl + '/api/product/list');
//             const response = await axios.get(backendUrl + '/api/product/list')
//             if (response.data.success) {
//                 setProducts(response.data.products);
//             }
//             else{
//                 toast.error(response.data.message);
//             }
            
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message);
            
//         }
//     }

//     // ShopContextProvider.js
//     const logout = () => {
//         // Clear user session data
//         setToken(""); // Clear the token from state
//         localStorage.removeItem("token"); // Remove token from local storage
//         setCartItems({}); // Clear the cart items
//         // Display a logout success message
//         toast.success("Logged out successfully");
    
        
//         };

    


    
//     useEffect(()=>{
//         getProductsData()
//     },[])

//     useEffect(()=>{
//         if (!token && localStorage.getItem('token')) {
//             setToken(localStorage.getItem('token'))
//         }
//     },[])

//     useEffect(() => {
//         if (!token) {
//             navigate("/login", { replace: true }); // Navigate to the login page
//         }
//     }, [token, navigate]);

//     const value = {
//         products , currency, delivery_fee,
//         search, setSearch, showSearch, setShowSearch,
//         cartItems, addToCart, getCartCount, updateQuantity,
//         getCartAmount, navigate, backendUrl, 
//         token, setToken, logout
    
//     }

//     return(
//         <ShopContext.Provider value={value}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }


// export default ShopContextProvider;