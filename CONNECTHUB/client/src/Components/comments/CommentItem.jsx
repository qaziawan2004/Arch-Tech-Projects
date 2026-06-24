import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { formatTimeAgo } from '../../utils/formatters';

// ===== COMMENT ITEM COMPONENT =====
const CommentItem = ({
  comment,
  onDelete,
  onEdit,
  currentUserId,
  isAuthor = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit?.(comment._id, editContent);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <Link to={`/user/${comment.user?._id}`}>
        <Avatar name={comment.user?.name} size="sm" />
      </Link>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Link to={`/user/${comment.user?._id}`} className="font-medium text-sm hover:underline">
            {comment.user?.name || 'Unknown User'}
          </Link>
          <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        
        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
            <div className="flex space-x-2 mt-1">
              <button
                onClick={handleSaveEdit}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-800 break-words">{comment.content}</p>
        )}
      </div>
      
      {/* Actions */}
      {isAuthor && !isEditing && (
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gray-400 hover:text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(comment._id)}
            className="text-xs text-gray-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ===== EXPORT DEFAULT =====
export default CommentItem;