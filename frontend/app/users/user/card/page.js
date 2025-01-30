"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const updateCartFromStorage = () => {
      const sessionCart = localStorage.getItem("cart");
      setCart(sessionCart ? JSON.parse(sessionCart) : []);
    };

    updateCartFromStorage();
    window.addEventListener("storageUpdated", updateCartFromStorage);

    return () => {
      window.removeEventListener("storageUpdated", updateCartFromStorage);
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const userinfo = localStorage.getItem("userinfo");

      if (!userinfo) {
        alert("User not logged in. Redirecting to login page.");
        window.location.href = "/";
        return;
      }

      const userData = JSON.parse(userinfo);
      const userId = userData.userid;

      try {
        const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          alert("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while fetching orders.");
      }
    };

    fetchOrders();
  }, []);

  const updateQuantity = (foodid, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.foodid === foodid
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storageUpdated"));
      return updatedCart;
    });
  };

  const removeItem = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.foodid !== itemId);
      if (updatedCart.length !== prevCart.length) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdated"));
      }
      return updatedCart;
    });
  };

  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setShowAddressModal(true);
  };

  const handleAddressSubmit = () => {
    setShowAddressModal(false);
    finishOrder();
  };

  const finishOrder = async () => {
    const totalPrice = calculateTotalPrice();
    const userinfo = localStorage.getItem("userinfo");

    if (!userinfo) {
      alert("User not logged in. Redirecting to login page.");
      window.location.href = "/";
      return;
    }

    const userData = JSON.parse(userinfo);
    const userId = userData.userid;
    const phoneNumber = userData.phonenumber || "Unknown";

    const orderDetails = {
      phonenumber: phoneNumber,
      userid: userId.toString(),
      total: totalPrice,
      address,
      orderItems: cart.map((item) => ({
        foodName: item.name,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
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
        {/* Cart Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-bold">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <table className="table-auto w-full mt-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-center">Quantity</th>
                    <th className="border px-4 py-2 text-right">Price</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={`${item.foodid}-${index}`}>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2 text-center">
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
                      <td className="border px-4 py-2 text-right">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-center">
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

              <p className="text-lg font-bold text-right mt-4">
                Total: LKR {calculateTotalPrice().toFixed(2)}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-black text-white font-bold rounded"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Address Confirmation Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-bold mb-4">Confirm Delivery Address</h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded"
                  onClick={handleAddressSubmit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Your Orders</h3>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">No</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Food Details</th>
                    <th className="border px-4 py-2 text-left">Total</th>
                    <th className="border px-4 py-2 text-left">Address</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by latest date
                    .map((order, index) => (
                      <tr key={order.orderId}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{order.orderDate}</td>
                        <td className="border px-4 py-2">
                          {order.orderItems
                            .map((item) => `${item.foodName}-${item.quantity}`)
                            .join(", ")}
                        </td>
                        <td className="border px-4 py-2">{order.total} LKR</td>
                        <td className="border px-4 py-2">{order.address}</td>
                        <td className="border px-4 py-2">{order.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
