import React from "react";
import { assets } from "../assets/assets";


const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div>
          <img src={assets.logo2} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Your satisfaction is our top priority. Explore the latest trends and
            discover exceptional products tailored just for you. Enjoy secure
            shopping with fast delivery and hassle-free returns, ensuring a
            seamless experience every time with <b style={{color:"sienna"}}>Fabrica</b>.
          </p>
        </div>

        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-1 text-gray-600">
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
                <li>Tel : +91 (167) 261-107 </li>
                <li>contact@fabrica.com</li>
            </ul>
        </div>

      </div>

      <div>
            <hr />
            <p className="py-5 text-sm text-center">Copyright 2024 @forever.com - All Rights Reserved</p>
        </div>

    </div>
  );
};

export default Footer;
