import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user data and their posts
    // For now, simulate
    setTimeout(() => {
      setUser({
        _id: userId,
        name: 'Jane Doe',
        email: 'jane@example.com',
        bio: 'React Developer',
        friends: [],
      });
      setPosts([
        { _id: 1, content: 'Hello world!', user: { name: 'Jane Doe' }, createdAt: new Date() },
      ]);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 flex justify-center items-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6">
            <div className="card text-center py-12">
              <p className="text-gray-500">User not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">
          {/* Profile Header */}
          <div className="card mb-6">
            <div className="flex items-center space-x-6">
              <Avatar name={user.name} size="xl" />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.bio || 'No bio'}</p>
                <p className="text-sm text-gray-400">{user.friends?.length || 0} friends</p>
              </div>
              <div className="ml-auto">
                <Button variant="primary">Add Friend</Button>
              </div>
            </div>
          </div>

          {/* Posts */}
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          {posts.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;