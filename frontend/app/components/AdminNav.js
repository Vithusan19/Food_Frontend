'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import userIcon from "../Assets/user.png";

export default function Admin() {
  const [username, setUsername] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
      const userData = JSON.parse(userinfo);
      setUsername(userData.username);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userinfo');
    router.push('/');
  };

  return (
    <div className="flex flex-col bg-gray-100 ">
      {/* Navbar */}
      <div className="bg-white flex items-center justify-between px-4 py-2 shadow-md">
        <h3 className="font-bold text-2xl">
          Uber <span className="text-green-500">Eats</span>
        </h3>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push('/users/admin')}
            className="text-gray-800 hover:text-green-500 font-medium"
          >
            Orders
          </button>
          <button
            onClick={() => router.push('/users/admin/foods')}
            className="text-gray-800 hover:text-green-500 font-medium"
          >
            Foods
          </button>
          <button
            onClick={() => router.push('/users/admin/users')}
            className="text-gray-800 hover:text-green-700 font-medium"
          >
            Users
          </button>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="text-gray-800 hover:text-green-700 font-medium flex items-center space-x-2"
          >
            <Image
              src={userIcon}
              alt="Profile"
              className="p-1 cursor-pointer w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute top-14 right-4 bg-white p-4 shadow-md rounded-lg">
          <p className="font-bold">{username}</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      
     
    </div>
  );
}
