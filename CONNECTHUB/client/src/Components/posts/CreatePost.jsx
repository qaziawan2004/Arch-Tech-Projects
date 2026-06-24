import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Call postService.createPost
      // For now, just simulate
      console.log('Post created:', content);
      onPostCreated?.();
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-start space-x-3">
        <Avatar name={user?.name} />
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-none focus:outline-none resize-none text-gray-800 placeholder-gray-400"
            rows="3"
          />
          <div className="flex justify-between items-center mt-2 border-t pt-2">
            <div className="flex space-x-2">
              <button type="button" className="text-gray-500 hover:text-blue-500">
                📷 Photo
              </button>
              <button type="button" className="text-gray-500 hover:text-blue-500">
                🎥 Video
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;