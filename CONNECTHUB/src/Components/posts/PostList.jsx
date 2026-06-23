import React from 'react';
import PostCard from './PostCard';
import Loader from '../ui/Loader';

// ===== POST LIST COMPONENT =====
const PostList = ({
  posts = [],
  loading = false,
  onLike,
  onComment,
  onDelete,
  emptyMessage = 'No posts yet. Be the first to post!',
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading posts..." />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// ===== EXPORT DEFAULT =====
export default PostList;