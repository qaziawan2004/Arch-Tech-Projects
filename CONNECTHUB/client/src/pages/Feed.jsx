import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/layout/Navbar';
import Sidebar from '../Components/layout/Sidebar';
import CreatePost from '../Components/posts/CreatePost';
import PostCard from '../Components/posts/PostCard';
import { postService } from '../services/postService';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when backend is ready
      // const response = await postService.getFeed();
      // setPosts(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setPosts([
          {
            _id: 1,
            content: 'Welcome to ConnectHub! 🎉',
            user: { _id: user?._id, name: user?.name || 'System' },
            likes: [],
            comments: [],
            createdAt: new Date(),
            isLiked: false,
          },
          {
            _id: 2,
            content: 'This is your first post. Start connecting!',
            user: { _id: user?._id, name: user?.name || 'System' },
            likes: [],
            comments: [],
            createdAt: new Date(),
            isLiked: false,
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleLike = (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked
                ? post.likes.filter(id => id !== user?._id)
                : [...post.likes, user?._id],
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">
          <CreatePost onPostCreated={handlePostCreated} />
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;