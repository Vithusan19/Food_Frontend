"use client";
import google from '../../Assets/google.png';
import apple from '../../Assets/appleIcon.png';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Link from 'next/link';

export default function Signup() {
  const [formdata, setformdata] = useState({
    username: "",
    phonenumber: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formdata.password !== formdata.confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formdata.username,
          phonenumber: formdata.phonenumber,
          password: formdata.password,
        }),
      });

      if (response.ok) {
        router.push('/regLogin/login')
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="mx-auto h-[80vh] w-[90vw] sm:w-[60vw] md:w-[80vw] lg:w-[28vw] mt-[10vh] rounded-lg shadow-lg flex flex-col items-center p-6 sm:p-8">
      <h2 className="text-base sm:text-lg mb-4 text-center font-bold">Create Your Account</h2>
      
     
      {error && <p className="text-red-500 text-center font-bold mb-4 ">{error}</p>}
      
     
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        value={formdata.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        required
      />

      
      <input
        type="text"
        name="phonenumber"
        placeholder="Enter phone number"
        value={formdata.phonenumber}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        required
      />

     
      <input
        type="password"
        name="password"
        value={formdata.password}
        onChange={handleChange}
        placeholder="Enter password"
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        required
      />

     
      <input
        type="password"
        name="confirmpassword"
        value={formdata.confirmpassword}
        onChange={handleChange}
        placeholder="Confirm password"
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        required
      />
      
     
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded font-semibold mb-4"
      >
        Sign Up
      </button>
      <div className="text-center mt-2 mb-3">
          <p className="text-gray-600">
                 Already have an account? 
               <Link href="/regLogin/login" className="text-blue-600 font-bold underline ml-1">
                Login
               </Link>
          </p>
      </div>

      <div className="flex items-center w-full mb-4 ">
        <hr className="flex-grow border-gray-400" />
        <span className="px-2 text-gray-400">or</span>
        <hr className="flex-grow border-gray-400" />
      </div>

     
     
      <button className="w-full bg-gray-200 py-2 rounded mb-2 flex items-center justify-center text-gray-700 font-semibold">
       <Image src={google} alt="Google logo" className="w-5 h-5 mr-2" />
        Continue with Google
      </button>
     
      
    

      <button className="w-full bg-gray-200 py-2 rounded mb-4 flex items-center justify-center text-gray-700 font-semibold">
        <Image src={apple} alt="Apple logo" className="w-5 h-5 mr-2" />
        Continue with Apple
      </button>

      <p className="text-center text-gray-500 text-xs px-4 mt-4">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
