"use client";
import Image from "next/image";
import food1 from "../../Assets/food1.png";
import userIcon from "../../Assets/user.png";
import cardIcon from "../../Assets/shoppingIcon.png";
import cry from "../../Assets/cry.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [food, setFood] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userinfo = localStorage.getItem("userinfo");
    if (userinfo) {
      const userData = JSON.parse(userinfo);
      setUsername(userData.username);
      setPhoneNumber(userData.phonenumber);
    } else {
      router.push("/");
    }
    getFood();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userinfo");
    localStorage.removeItem("cart");
    router.push("/");
  };

  const getFood = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/food", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const foodData = await response.json();
        setFood(foodData);
        setFilteredFood(foodData);
      } else {
        throw new Error("Failed to fetch food details");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem.foodid === item.foodid
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      if (!prevCart.some((cartItem) => cartItem.foodid === item.foodid)) {
        updatedCart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleCartClick = () => {
    router.push("/users/user/card");
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFood(food.filter((item) => item.name.toLowerCase().includes(query)));
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <div className="bg-white flex items-center justify-between px-6 py-3 shadow-md">
        <h3 className="font-bold text-2xl">
          Uber <span className="text-green-500">Eats</span>
        </h3>
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <Image src={cardIcon} alt="Cart" className="p-2" />
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </div>
            )}
          </div>

          {/* Profile Icon */}
          <div className="relative">
            <Image
              src={userIcon}
              alt="Profile"
              className="cursor-pointer w-10 h-10 rounded-full"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="absolute top-12 right-0 bg-white p-4 shadow-lg rounded-lg w-48 border">
                <p className="font-bold text-lg text-gray-800">{username}</p>
                <p className="text-gray-600 text-sm">📞 {phoneNumber}</p>
                <button
                  className="mt-3 w-full px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex justify-center items-center mt-4 mb-4">
          <input
            type="text"
            placeholder="Search food by name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-[60vw] p-2 border rounded-lg shadow-md focus:ring focus:ring-green-300"
          />
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-[90%] m-auto">
          {filteredFood.length > 0 ? (
            filteredFood.map((item) => (
              <div key={item.foodid} className="p-4 bg-white rounded-lg shadow-md border">
                <Image className="bg-cover" src={food1} alt="Food image" />
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-800 font-semibold">LKR {item.price}</p>
                <p className={`text-sm ${item.status ? "text-green-600" : "text-red-600"}`}>
                  Status: {item.status ? "Available" : "Unavailable"}
                </p>
                {item.status && (
                  <button
                    className="mt-2 px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-screen">
              <Image src={cry} alt="Not Found" className="w-24 h-24 mb-4" />
              <p className="text-gray-800 text-2xl font-bold text-center">
                No food details available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
