import React, { useState } from 'react';
import Button from '../ui/Button';

// ===== FRIEND REQUEST BUTTON COMPONENT =====
const FriendRequestButton = ({
  userId,
  status = 'none', // 'none' | 'sent' | 'received' | 'friends'
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onRemoveFriend,
  size = 'md',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action, ...args) => {
    setLoading(true);
    try {
      await action(...args);
    } catch (error) {
      console.error('Friend action error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render based on status
  switch (status) {
    case 'friends':
      return (
        <Button
          variant="danger"
          size={size}
          className={className}
          onClick={() => handleAction(onRemoveFriend, userId)}
          loading={loading}
        >
          Remove Friend
        </Button>
      );

    case 'sent':
      return (
        <Button
          variant="secondary"
          size={size}
          className={className}
          onClick={() => handleAction(onCancelRequest, userId)}
          loading={loading}
        >
          Cancel Request
        </Button>
      );

    case 'received':
      return (
        <div className={`flex space-x-2 ${className}`}>
          <Button
            variant="success"
            size={size}
            onClick={() => handleAction(onAcceptRequest, userId)}
            loading={loading}
          >
            Accept
          </Button>
          <Button
            variant="secondary"
            size={size}
            onClick={() => handleAction(onRejectRequest, userId)}
            loading={loading}
          >
            Reject
          </Button>
        </div>
      );

    default:
      return (
        <Button
          variant="primary"
          size={size}
          className={className}
          onClick={() => handleAction(onSendRequest, userId)}
          loading={loading}
        >
          Add Friend
        </Button>
      );
  }
};

// ===== EXPORT DEFAULT =====
export default FriendRequestButton;