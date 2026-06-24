import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

// ===== FRIEND LIST COMPONENT =====
const FriendList = ({
  friends = [],
  onRemoveFriend,
  loading = false,
  emptyMessage = 'No friends yet',
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading friends...</p>
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3">
            <Link to={`/user/${friend._id}`}>
              <Avatar name={friend.name} size="lg" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/user/${friend._id}`} className="font-medium hover:underline truncate block">
                {friend.name}
              </Link>
              <p className="text-sm text-gray-500 truncate">{friend.email}</p>
            </div>
          </div>
          {onRemoveFriend && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button
                variant="danger"
                size="sm"
                fullWidth
                onClick={() => onRemoveFriend(friend._id)}
              >
                Remove Friend
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===== EXPORT DEFAULT =====
export default FriendList;