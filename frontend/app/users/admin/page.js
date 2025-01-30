'use client';

import { useState, useEffect } from "react";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend
  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Filter orders based on their status
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const finishedOrders = orders.filter((order) => order.status === "finished");

  // Calculate total earnings from finished orders
  const totalEarnings = finishedOrders.reduce((sum, order) => sum + order.total, 0);

  // Handle status update
  const handleStatusChange = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "POST", // Change PUT to POST
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: "finished" } : order
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  // Render orders
  const renderOrders = (ordersList) =>
    ordersList.map((order) => (
      <div key={order.orderId} className="grid grid-cols-6 items-center border-b p-4">
        <p>{order.orderId}</p>
        <p>
          {order.orderItems.map((item, index) => (
            <span key={index}>
              {item.foodName} (x{item.quantity})<br />
            </span>
          ))}
        </p>
        <p>LKR {order.total}</p>
        <p>{order.userid}</p>
        <p>{order.address}</p>
        <p>
          {order.status === "pending" ? (
            <button
              onClick={() => handleStatusChange(order.orderId)}
              className="bg-black text-white px-4 py-2 font-bold rounded-md hover:bg-gray-600"
            >
              Finish
            </button>
          ) : (
            <span className="text-green-700 font-bold">Finished</span>
          )}
        </p>
      </div>
    ));

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="p-6">
        {/* Top Section: Number of Pending Orders */}
        <div className="mb-6 text-lg font-semibold">
          Total Pending Orders: {pendingOrders.length}
        </div>

        {/* Pending Orders */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
          <div className="grid grid-cols-6 font-bold border-b pb-2">
            <p>Order ID</p>
            <p>Items</p>
            <p>Price</p>
            <p>User ID</p>
            <p>Address</p>
            <p>Status</p>
          </div>
          {pendingOrders.length > 0 ? (
            renderOrders(pendingOrders)
          ) : (
            <p className="text-gray-700 mt-4">No pending orders.</p>
          )}
        </section>

        {/* Finished Orders */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Finished Orders</h2>
          <div className="grid grid-cols-6 font-bold border-b pb-2">
            <p>Order ID</p>
            <p>Items</p>
            <p>Price</p>
            <p>User ID</p>
            <p>Address</p>
            <p>Status</p>
          </div>
          {finishedOrders.length > 0 ? (
            <>
              {renderOrders(finishedOrders)}
              <div className="mt-4 text-lg font-semibold">
                Total Earnings: LKR {totalEarnings}
              </div>
            </>
          ) : (
            <p className="text-gray-700 mt-4">No finished orders.</p>
          )}
        </section>
      </div>
    </div>
  );
}
