import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  
const { backendUrl, token, currency } = useContext(ShopContext);
const [orderData, setOrderData] = useState([]);

const loadOrderData = async () => {
  try {
    if (!token) {
      return null;
    }

    const response = await axios.post(backendUrl + '/api/order/userorders',{}, {headers:{token}});
    if(response.data.success){
      let allOrderItem = []
      response.data.orders.map((order)=>{
        order.items.map((item)=>{
          item['status'] = order.status;
          item['payment'] = order.payment;
          item['paymentMethod'] = order.paymentMethod;
          item['date'] = order.date;
          allOrderItem.push(item);
        })
      })
      setOrderData(allOrderItem.reverse())
    }


  }
  catch{
    console.log(error);
  }
}

// const loadOrderData = async () => {
//   try {
//     if (!token) {
//       return null;
//     }

//     const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });

//     console.log('API Response:', response.data); // Log the entire response

//     // Check if success and Orders are present
//     if (response.data.success) {
//       const orders = response.data.orders; // Access 'orders' correctly
//       console.log('Orders:', orders); // Log Orders to see if it’s as expected

//       if (Array.isArray(orders)) {
//         let allOrdersItem = [];
//         orders.forEach((order, orderIndex) => {
//           console.log(`Order ${orderIndex}:`, order); // Log each order to debug

//           const items = order.items; // Access items correctly
//           console.log(`Items in Order ${orderIndex}:`, items); // Log items for the order

//           if (Array.isArray(items)) {
//             items.forEach((item) => {
//               item['status'] = order.status;
//               item['payment'] = order.payment;
//               item['paymentMethod'] = order.paymentMethod;
//               item['date'] = order.date;
//               allOrdersItem.push(item);
//             });
//           } else {
//             console.error(`Order ${orderIndex} does not contain a valid item array:`, items);
//           }
//         });

//         console.log('All Orders Items:', allOrdersItem); // Log to verify what’s being pushed
//         setOrderData(allOrdersItem);
//       } else {
//         console.error('Orders is not an array or is undefined:', orders);
//       }
//     } else {
//       console.error('Response was not successful:', response.data);
//     }
//   } catch (error) {
//     console.error('Error fetching order data:', error);
//   }
// };


useEffect(()=>{
  loadOrderData();
},[token]);


  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className=''>
        {
          orderData.map((item, index)=>(
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity : {item.quantity}</p>
                    <p>Size: {item.sizes}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base hover:text-blue-400'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm  hover:bg-black hover:text-white transition-all duration-500'>Track Order</button>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders;

