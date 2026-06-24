import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/feed', label: 'Feed', icon: '📰' },
    { path: '/profile', label: 'My Profile', icon: '👤' },
    { path: '/friends', label: 'Friends', icon: '👥' },
    { path: '/friend-requests', label: 'Friend Requests', icon: '✉️' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 p-4">
      <div className="flex items-center space-x-3 mb-8 p-2 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="font-semibold">{user?.name || 'User'}</p>
          <p className="text-sm text-gray-500">{user?.email || ''}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;