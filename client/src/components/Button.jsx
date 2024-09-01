import React from 'react';

const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
