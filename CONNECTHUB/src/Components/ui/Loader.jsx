import React from 'react';

// ===== LOADER COMPONENT =====
const Loader = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text = '',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    success: 'border-green-600 border-t-transparent',
    danger: 'border-red-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const loader = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizes[size]} 
          ${colors[color]} 
          rounded-full 
          animate-spin
          border-solid
        `}
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

// ===== EXPORT DEFAULT =====
export default Loader;