"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import bgimg from "./Assets/background.png"; 
import first from "./Assets/firstimg.png"; 
import second from "./Assets/second.png";
import menuIcon from "./Assets/menuIcon.png";
import third from "./Assets/third.jpg";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");

  const Moveloginpage = () => {
    router.push("/regLogin/login");
  };
  useEffect(()=>{
    localStorage.removeItem("cart");
  })

  const Movesignuppage = () => {
    router.push("/regLogin/signup");
  };
  useEffect(() => {
    const userinfo = localStorage.getItem("userinfo");
    if (userinfo) {
      const userData = JSON.parse(userinfo);
      setUsername(userData.username);
      if (userData.userRole === "admin") {
        router.push("/users/admin");
      } else if (userData.userRole === "user") {
        router.push("/users/user");
      }
    }
  }, [router]);
  
  

  return (
    <>
      <div className="container mx-auto bg-white">
        <nav className="flex justify-between items-center py-4 px-4 md:px-0 relative">
          <h3 className="text-black font-bold text-2xl md:text-1xl">Uber Eats</h3>
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={Moveloginpage}
              className="bg-white text-black rounded-full py-2 px-4 md:px-6 font-semibold hover:bg-gray-100"
            >
              Log in
            </button>
            <button
              onClick={Movesignuppage}
              className="bg-black text-white rounded-full py-2 px-4 md:px-6 font-semibold hover:bg-gray-800"
            >
              Sign up
            </button>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black bg-gray-100 p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Image src={menuIcon} alt="icon" className="bg-cover w-6"/>
            
          </button>
          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 z-10">
              <button
                onClick={Moveloginpage}
                className="bg-white text-black rounded-full py-2 px-4 font-semibold hover:bg-gray-100"
              >
                Log in
              </button>
              <button
                onClick={Movesignuppage}
                className="bg-black text-white rounded-full py-2 px-4 font-semibold hover:bg-gray-800"
              >
                Sign up
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Background Section */}
      <div className="relative w-full h-[500px] md:h-[900px] flex justify-center items-center">
        <Image src={bgimg} layout="fill" objectFit="cover" alt="Background" />
        <div className="absolute inset-0 flex flex-col justify-center items-baseline px-4">
          <h1 className="text-2xl md:text-4xl text-black font-bold mb-6">
            Order delivery near you
          </h1>
          <form className="flex flex-col md:flex-row w-full max-w-lg gap-2">
            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full px-4 py-3 rounded-md border border-gray-300"
            />
            <select className="w-full md:w-auto px-4 py-3 rounded-md border border-gray-300">
              <option value="now">Deliver now</option>
              <option value="later">Deliver later</option>
            </select>
            <button className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800">
              Find Food
            </button>
          </form>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-16 px-4 md:px-8">
        <div className="text-center bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <Image
            src={first}
            alt="Feed your employees"
            width={300}
            height={200}
            className="rounded-t-lg m-auto w-[300px] sm:w-[400px] md:w-full"
          />
          <h3 className="font-bold text-xl mt-4">Feed your employees</h3>
          <a href="#" className="font-medium hover:underline">
            Create a business account
          </a>
        </div>
        <div className="text-center bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <Image
            src={second}
            alt="Your restaurant, delivered"
            width={300}
            height={200}
            className="rounded-t-lg m-auto w-[300px] sm:w-[400px] md:w-full"
          />
          <h3 className="font-bold text-xl mt-4">Your restaurant, delivered</h3>
          <a href="#" className="font-medium hover:underline">
            Add your restaurant
          </a>
        </div>
        <div className="text-center bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <Image
            src={third}
            alt="Deliver with Uber Eats"
            width={300}
            height={200}
            className="rounded-t-lg m-auto w-[300px] sm:w-[400px] md:w-full"
          />
          <h3 className="font-bold text-xl mt-4">Deliver with Uber Eats</h3>
          <a href="#" className="font-medium hover:underline">
            Sign up to deliver
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}
