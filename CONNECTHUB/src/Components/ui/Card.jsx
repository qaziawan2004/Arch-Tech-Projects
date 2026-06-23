import React from 'react';

// ===== CARD COMPONENT =====
const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  bordered = false,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const borderClass = bordered ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        bg-white 
        rounded-xl 
        ${paddings[padding]} 
        ${shadows[shadow]} 
        ${hoverClass} 
        ${borderClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ===== EXPORT DEFAULT =====
export default Card;