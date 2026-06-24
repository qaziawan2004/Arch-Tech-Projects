import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/layout/Navbar';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-600">Add your bio here...</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;