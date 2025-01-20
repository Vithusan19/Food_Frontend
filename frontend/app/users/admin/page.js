'use client';

import { useState } from "react";

export default function OrderPage() {
  // Static JSON data for orders
  const initialOrders = [
    {
      orderid: 1,
      orderitems: ["Burger", "Fries"],
      price: 1200,
      userid: "user1",
      address: "123 Main Street",
      status: "Pending",
    },
    {
      orderid: 2,
      orderitems: ["Pizza", "Coke"],
      price: 1800,
      userid: "user2",
      address: "456 Oak Avenue",
      status: "Finished",
    },
    {
      orderid: 3,
      orderitems: ["Pasta", "Garlic Bread"],
      price: 1500,
      userid: "user3",
      address: "789 Pine Road",
      status: "Pending",
    },
    {
      orderid: 4,
      orderitems: ["Salad", "Soup"],
      price: 1000,
      userid: "user4",
      address: "321 Elm Street",
      status: "Pending",
    },
    {
      orderid: 5,
      orderitems: ["Sushi", "Miso Soup"],
      price: 2200,
      userid: "user5",
      address: "654 Maple Drive",
      status: "In Progress",
    },
    {
      orderid: 6,
      orderitems: ["Steak", "Mashed Potatoes"],
      price: 2500,
      userid: "user6",
      address: "876 Birch Lane",
      status: "Finished",
    },
    {
      orderid: 7,
      orderitems: ["Chicken Wings", "Beer"],
      price: 1700,
      userid: "user7",
      address: "987 Cedar Road",
      status: "Pending",
    },
    {
      orderid: 8,
      orderitems: ["Veggie Burger", "Smoothie"],
      price: 1400,
      userid: "user8",
      address: "543 Spruce Court",
      status: "Cancelled",
    },
    {
      orderid: 9,
      orderitems: ["Fish and Chips", "Lemonade"],
      price: 1600,
      userid: "user9",
      address: "123 Willow Way",
      status: "Finished",
    },
    {
      orderid: 10,
      orderitems: ["Ramen", "Green Tea"],
      price: 1900,
      userid: "user10",
      address: "321 Cherry Lane",
      status: "In Progress",
    },
    {
      orderid: 11,
      orderitems: ["Tacos", "Salsa"],
      price: 1300,
      userid: "user11",
      address: "567 Aspen Street",
      status: "Pending",
    },
    {
      orderid: 12,
      orderitems: ["Pancakes", "Coffee"],
      price: 800,
      userid: "user12",
      address: "789 Walnut Avenue",
      status: "Finished",
    },
    {
      orderid: 13,
      orderitems: ["Biryani", "Raita"],
      price: 1500,
      userid: "user13",
      address: "654 Cypress Boulevard",
      status: "In Progress",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);

  // Filter orders based on their status
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const finishedOrders = orders.filter((order) => order.status === "Finished");

  // Calculate the total earnings from finished orders
  const totalEarnings = finishedOrders.reduce((sum, order) => sum + order.price, 0);

  // Handle marking an order as finished
  const handleStatusChange = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderid === orderId
          ? { ...order, status: "Finished" }
          : order
      )
    );
  };

  const renderOrders = (ordersList) =>
    ordersList.map((order) => (
      <div
        key={order.orderid}
        className="grid grid-cols-6 items-center border-b p-4"
      >
        <p>{order.orderid}</p>
        <p>{order.orderitems.join(", ")}</p>
        <p>LKR {order.price}</p>
        <p>{order.userid}</p>
        <p>{order.address}</p>
        <p>
          {order.status === "Pending" ? (
            <button
              onClick={() => handleStatusChange(order.orderid)}
              className="bg-black text-white px-4 py-2 font-bold rounded-md hover:bg-gray-600"
            >
              Finish
            </button>
          ) : (
            <span className="text-green-700 font-bold" >Finished</span>
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
