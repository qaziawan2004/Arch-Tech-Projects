import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/feed" className="text-xl font-bold text-blue-600">
          ConnectHub
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/feed" className="text-gray-700 hover:text-blue-600">
            Feed
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          {user && (
            <span className="text-sm text-gray-600">
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;