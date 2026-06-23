import api from './api';

export const postService = {
  // Get all posts (feed)
  getFeed: async () => {
    const response = await api.get('/posts/feed');
    return response.data;
  },

  // Get posts by user ID
  getUserPosts: async (userId) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },

  // Create a new post
  createPost: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // Delete a post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like a post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Unlike a post
  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },
};