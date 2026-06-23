// ===== APP CONFIGURATION =====
export const APP_NAME = 'ConnectHub';
export const APP_DESCRIPTION = 'A modern social networking platform';

// ===== API ENDPOINTS =====
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// ===== ROUTES =====
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/profile',
  USER_PROFILE: '/user/:userId',
  FRIEND_REQUESTS: '/friend-requests',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
};

// ===== POST TYPES =====
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
};

// ===== PRIVACY SETTINGS =====
export const PRIVACY = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private',
};

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPT: 'friend_accept',
  SHARE: 'share',
  MENTION: 'mention',
};

// ===== VALIDATION =====
export const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PASSWORD_MIN: 6,
  BIO_MAX: 200,
  POST_MAX: 5000,
  COMMENT_MAX: 1000,
};

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

// ===== FILE UPLOAD =====
export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
};

// ===== SOCKET EVENTS =====
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_POST: 'new_post',
  NEW_COMMENT: 'new_comment',
  NEW_LIKE: 'new_like',
  NEW_FRIEND_REQUEST: 'new_friend_request',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
  NEW_NOTIFICATION: 'new_notification',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
};