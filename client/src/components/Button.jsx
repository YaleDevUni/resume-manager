import React from 'react';

const Button = ({ onClick, children, className, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border rounded-lg p-1 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
