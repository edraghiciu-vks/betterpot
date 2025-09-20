import { JSX } from 'solid-js';

// Button component for SolidJS
interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  title?: string;
  [key: string]: any;
}

export const Button = (props: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = () => {
    switch (props.variant || 'primary') {
      case 'primary':
        return 'bg-orange-500 hover:bg-orange-600 text-white disabled:hover:bg-orange-500';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white disabled:hover:bg-gray-600';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-700 text-gray-300 disabled:hover:bg-transparent';
      default:
        return 'bg-orange-500 hover:bg-orange-600 text-white disabled:hover:bg-orange-500';
    }
  };
  
  return (
    <button 
      class={`${baseClasses} ${variantClasses()}`}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
    >
      {props.children}
    </button>
  );
};