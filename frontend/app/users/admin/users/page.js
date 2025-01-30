"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import usericon from "../../../Assets/usericon1.png";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const filteredData = userData.filter((user) => user.userRole === "user");
        setUsers(filteredData);
        setFilteredUsers(filteredData);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userid) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers(); // Refresh user list
        setDeleteConfirm(null); // Close confirmation popup
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="mb-6 w-[80%] m-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[80%] m-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.userid}
                className="bg-white p-4 shadow-md rounded-2xl flex items-center"
              >
                {/* Left: User Image */}
                <div className="w-24 h-24 mr-4">
                  <Image
                    src={usericon}
                    alt="User image"
                    width={96}
                    height={96}
                    className="object-cover rounded-full"
                  />
                </div>

                {/* Right: User Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">ID: {user.userid}</h3>
                  <p className="text-lg font-semibold">{user.username}</p>
                  <p className="text-gray-600">Phone: {user.phonenumber}</p>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirm(user.userid)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 mt-3"
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
              No users available.
            </p>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-800 font-bold text-lg mb-4">
                Are you sure you want to delete this user?
              </p>
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
