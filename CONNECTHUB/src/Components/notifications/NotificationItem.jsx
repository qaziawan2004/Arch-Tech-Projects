import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { _id, type, message, read, createdAt } = notification;

  const getIcon = () => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'friend':
        return '👥';
      default:
        return '🔔';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={`card p-3 hover:shadow-md transition cursor-pointer ${!read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
      onClick={() => onMarkAsRead(_id)}
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-gray-800">{message}</p>
          <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
        </div>
        {!read && (
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;