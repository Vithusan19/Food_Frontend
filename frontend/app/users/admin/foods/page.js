'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import foodPlaceholder from "../../../Assets/Food1.png";

export default function Admin() {
  const [food, setFood] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editFood, setEditFood] = useState(null); // Edit popup state
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Delete confirmation popup state
  const [showAddPopup, setShowAddPopup] = useState(false); // Add food popup state
  const [newFood, setNewFood] = useState({
    name: "",
    description: "",
    price: "",
    status: true,
  });

  useEffect(() => {
    getFood();
  }, []);

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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFood(
      food.filter((item) => item.name.toLowerCase().includes(query))
    );
  };

  // Add Food
  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/addfood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFood),
      });

      if (response.ok) {
        getFood(); // Refresh food list
        setShowAddPopup(false); // Close popup
        setNewFood({ name: "", description: "", price: "", status: true }); // Reset form
      } else {
        throw new Error("Failed to add food");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Food
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/food/${editFood.foodid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFood),
      });

      if (response.ok) {
        getFood(); // Refresh food list
        setEditFood(null); // Close the edit popup
      } else {
        throw new Error("Failed to update food details");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Food
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/food/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        getFood(); // Refresh food list
        setDeleteConfirm(null); // Close confirmation popup
      } else {
        throw new Error("Failed to delete food");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="flex justify-center items-center mt-4 mb-4">
          <input
            type="text"
            placeholder="Search food by name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-[60vw] p-2 border rounded-lg"
          />
        </div>

        {filteredFood.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-[95%] mx-auto">
            {filteredFood.map((item) => (
              <div
                key={item.foodid}
                className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg"
              >
                <div className="w-40 h-40 mb-4">
                  <Image
                    src={foodPlaceholder}
                    alt="Food image"
                    width={96}
                    height={96}
                    className="object-cover rounded-md w-40 h-40"
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-800 font-semibold">LKR {item.price}</p>
                  <p
                    className={`text-sm ${
                      item.status ? "text-green-600  font-bold" : "text-red-600 font-bold"
                    }`}
                  >
                    Status: {item.status ? "Available" : "Unavailable"}
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setEditFood(item)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.foodid)}
                    className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-64">
            <p className="text-gray-800 text-lg font-bold text-center">
              No food details available.
            </p>
          </div>
        )}

        {/* Add Food Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600"
          >
            Add Food
          </button>
        </div>

        {/* Add Food Popup */}
        {showAddPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%]">
              <h2 className="font-bold text-xl mb-4">Add New Food</h2>
              <form onSubmit={handleAddFood}>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) =>
                      setNewFood({ ...newFood, name: e.target.value })
                    }
                    placeholder="Food Name"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={newFood.description}
                    onChange={(e) =>
                      setNewFood({ ...newFood, description: e.target.value })
                    }
                    placeholder="Description"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    value={newFood.price}
                    onChange={(e) =>
                      setNewFood({ ...newFood, price: e.target.value })
                    }
                    placeholder="Price"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <select
                    value={newFood.status}
                    onChange={(e) =>
                      setNewFood({
                        ...newFood,
                        status: e.target.value === "true",
                      })
                    }
                    className="p-2 border rounded-lg"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPopup(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Add Food
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Food Popup */}
        {editFood && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%]">
              <h2 className="font-bold text-xl mb-4">Edit Food Details</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={editFood.name}
                    onChange={(e) =>
                      setEditFood({ ...editFood, name: e.target.value })
                    }
                    placeholder="Food Name"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={editFood.description}
                    onChange={(e) =>
                      setEditFood({ ...editFood, description: e.target.value })
                    }
                    placeholder="Description"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    value={editFood.price}
                    onChange={(e) =>
                      setEditFood({ ...editFood, price: e.target.value })
                    }
                    placeholder="Price"
                    className="p-2 border rounded-lg"
                    required
                  />
                  <select
                    value={editFood.status}
                    onChange={(e) =>
                      setEditFood({
                        ...editFood,
                        status: e.target.value === "true",
                      })
                    }
                    className="p-2 border rounded-lg"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditFood(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%]">
              <h2 className="font-bold text-xl mb-4">
                Are you sure you want to delete this food item?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
