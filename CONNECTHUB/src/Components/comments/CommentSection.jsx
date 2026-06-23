import React, { useState } from 'react';
import CommentItem from './CommentItem';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

// ===== COMMENT SECTION COMPONENT =====
const CommentSection = ({
  postId,
  comments = [],
  onAddComment,
  onDeleteComment,
  onEditComment,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment?.(postId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-4">
        <Avatar name={user?.name} size="sm" />
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!newComment.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Post
        </Button>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <p className="text-sm text-gray-400 text-center">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">No comments yet</p>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              currentUserId={user?._id}
              isAuthor={comment.user?._id === user?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== EXPORT DEFAULT =====
export default CommentSection;