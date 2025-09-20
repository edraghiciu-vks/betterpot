import { ReactNode } from 'react';

// Button component placeholder
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  [key: string]: any;
}

export const Button = ({ children, onClick, variant = 'primary', ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white', 
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}