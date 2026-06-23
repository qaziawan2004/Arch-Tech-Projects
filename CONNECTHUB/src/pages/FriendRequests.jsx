import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

const FriendRequests = () => {
  const [requests, setRequests] = useState([
    { _id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { _id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  ]);

  const handleAccept = (id) => {
    setRequests(prev => prev.filter(req => req._id !== id));
    alert(`Friend request accepted!`);
  };

  const handleReject = (id) => {
    setRequests(prev => prev.filter(req => req._id !== id));
    alert(`Friend request rejected.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
          
          {requests.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No friend requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="card flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar name={request.name} />
                    <div>
                      <p className="font-semibold">{request.name}</p>
                      <p className="text-sm text-gray-500">{request.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="success" size="sm" onClick={() => handleAccept(request._id)}>
                      Accept
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(request._id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;