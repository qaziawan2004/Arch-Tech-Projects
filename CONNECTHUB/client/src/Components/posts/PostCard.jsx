import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const PostCard = ({ post, onLike, onComment }) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    onLike?.(post._id);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/user/${post.user?._id || '#'}`}>
            <Avatar name={post.user?.name} />
          </Link>
          <div>
            <Link to={`/user/${post.user?._id || '#'}`} className="font-semibold hover:underline">
              {post.user?.name || 'Unknown User'}
            </Link>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">⋯</button>
      </div>

      {/* Post Content */}
      <div className="mt-3">
        <p className="text-gray-800">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="mt-3 rounded-lg max-h-96 w-full object-cover" />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center space-x-4 mt-4 pt-3 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
        >
          <span>❤️</span>
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
        >
          <span>💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
          <span>↗️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm text-gray-400 text-center">Comments coming soon!</p>
        </div>
      )}
    </div>
  );
};

export default PostCard;