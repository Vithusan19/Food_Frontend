import React from "react";
import Image from "next/image";
import apple from '../Assets/apple.jpg'
import play from '../Assets/play.png'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-10 px-4 md:px-8  text-white">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 flex flex-col">
          <h3 className="font-bold">Get Help</h3>
          <a href="#" className=" text-white hover:underline">Add your restaurant</a>
          <a href="#" className=" text-white hover:underline">Sign up to deliver</a>
          <a href="#" className=" text-white hover:underline">Create a business account</a>
        </div>
        <div className="space-y-2  flex flex-col">
          <h3 className="font-bold">Explore</h3>
          <a href="#" className=" text-white hover:underline">Restaurants near me</a>
          <a href="#" className=" text-white hover:underline">View all cities</a>
          <a href="#" className=" text-white hover:underline">View all countries</a>
          <a href="#" className=" text-white hover:underline">Pickup near me</a>
          <a href="#" className=" text-white hover:underline">Shop groceries</a>
          <a href="#" className=" text-white0 hover:underline">About Uber Eats</a>
        </div>
        <div className="flex flex-col items-center space-y-4">
        {/* <div className="flex gap-4">
        <a href="#">
          <Image src={apple} alt="App Store" className="h-20 w-48 md:h-16 md:w-40 lg:h-20 lg:w-48" />
        </a>
        <a href="#">
          <Image src={play} alt="Google Play" className="h-18 w-48 md:h-16 md:w-40 lg:h-20 lg:w-48" />
        </a>
      </div> */}

          
        </div>
      </div>
      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm  text-white">
        <p>
          Privacy Policy | Terms | Pricing | Do not sell or share my personal information
        </p>
        <p className="text-xs mt-2">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
        <p className="mt-2">© 2024 Uber  Inc.</p>
      </div>
    </div>
  </footer>
  );
}
