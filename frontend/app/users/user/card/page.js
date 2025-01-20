"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    const updateCartFromStorage = () => {
      const sessionCart = localStorage.getItem("cart");
      setCart(sessionCart ? JSON.parse(sessionCart) : []);
    };

    // Initial cart load
    updateCartFromStorage();

    // Listen for cart updates
    window.addEventListener("storageUpdated", updateCartFromStorage);

    return () => {
      window.removeEventListener("storageUpdated", updateCartFromStorage);
    };
  }, []);

  const updateQuantity = (foodid, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.foodid === foodid
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storageUpdated")); // Sync with other pages
      return updatedCart;
    });
  };

  const removeItem = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.foodid !== itemId);
      if (updatedCart.length !== prevCart.length) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdated")); // Sync with other pages
      }
      return updatedCart;
    });
  };

  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const finishOrder = async () => {
    const totalPrice = calculateTotalPrice();
    const userId = localStorage.getItem("userId"); // Replace with actual user ID logic

    const orderDetails = {
      orderItems: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      address,
      totalPrice,
      user: { userid: userId }, // Reference to the user
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        setAddress("");
        setIsCheckout(false);
      } else {
        alert("Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
        <header className="bg-white p-4 mb-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          {cart.length === 0 && (
            <p className="text-gray-600">Your cart is empty.</p>
          )}
        </header>

        {cart.length > 0 && (
          <div className="flex-grow">
            <table className="w-full bg-white rounded-lg shadow-md mb-6">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={`${item.foodid}-${index}`}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="px-2 py-1 bg-gray-200 text-black rounded"
                        onClick={() => updateQuantity(item.foodid, -1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 text-black rounded"
                        onClick={() => updateQuantity(item.foodid, 1)}
                      >
                        +
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => removeItem(item.foodid)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Price */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <p className="text-lg font-bold text-right">
                Total: LKR {calculateTotalPrice().toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-black text-white font-bold rounded"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {isCheckout && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-bold mb-2">Enter Address</h3>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={finishOrder}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </>
  );
}
