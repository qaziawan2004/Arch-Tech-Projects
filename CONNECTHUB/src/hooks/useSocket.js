import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

// ===== CUSTOM HOOK FOR SOCKET =====
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

// ===== EXPORT DEFAULT =====
export default useSocket;