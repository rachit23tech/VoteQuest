'use client';

import React from 'react';

interface CardProps {
  variant?: 'elevated' | 'outlined';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'elevated',
  className = '',
  children 
}) => {
  const baseStyles = 'rounded-lg p-4 transition-all duration-200';
  
  const variantStyles = {
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
