import api from './api';

export const friendService = {
  // Get all friends
  getFriends: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  // Get friend requests
  getFriendRequests: async () => {
    const response = await api.get('/friends/requests');
    return response.data;
  },

  // Send friend request
  sendRequest: async (userId) => {
    const response = await api.post(`/friends/request/${userId}`);
    return response.data;
  },

  // Accept friend request
  acceptRequest: async (requestId) => {
    const response = await api.put(`/friends/accept/${requestId}`);
    return response.data;
  },

  // Reject friend request
  rejectRequest: async (requestId) => {
    const response = await api.delete(`/friends/reject/${requestId}`);
    return response.data;
  },

  // Remove friend
  removeFriend: async (userId) => {
    const response = await api.delete(`/friends/${userId}`);
    return response.data;
  },
};