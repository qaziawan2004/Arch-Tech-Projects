import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import NotificationItem from '../components/notifications/NotificationItem';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { _id: 1, type: 'like', message: 'Alice liked your post', read: false, createdAt: new Date() },
    { _id: 2, type: 'friend', message: 'Bob sent you a friend request', read: false, createdAt: new Date() },
    { _id: 3, type: 'comment', message: 'Charlie commented on your post', read: true, createdAt: new Date() },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500">{unreadCount} unread</span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;