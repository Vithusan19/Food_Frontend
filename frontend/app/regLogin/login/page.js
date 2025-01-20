"use client";
import google from "../../Assets/google.png";
import apple from "../../Assets/appleIcon.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        
        localStorage.setItem("userinfo", JSON.stringify(result));

        if (result.userRole === "admin") {
          router.push("/users/admin");
        } else {
          router.push("/users/user");
        }
      } else if (response.status === 401) {
        setError("Username or password incorrect");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="mx-auto h-[60vh] w-[90vw] sm:w-[60vw] md:w-[40vw] lg:w-[24vw] mt-[10vh] rounded-lg shadow-lg flex flex-col items-center p-6 sm:p-8">
        <h2 className="text-base sm:text-lg mb-4 text-center font-bold">Login to Your Account</h2>

       
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
          placeholder="Enter username"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        />

       
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Enter password"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-gray-700"
        />

        {error && <p className="text-red-500 text-sm font-bold mb-2 ">{error}</p>}

        <button
          className="w-full bg-black text-white py-2 rounded font-semibold mb-4"
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className="text-center mt-2 mb-3">
          <p className="text-gray-600">
            Already haven't an account?
            <Link href="/regLogin/signup" className="text-blue-600 font-bold underline ml-1">
              Signup
            </Link>
          </p>
        </div>

        <div className="flex items-center w-full mb-4">
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
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
}
