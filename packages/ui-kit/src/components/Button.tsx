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
  
  const getButtonStyles = () => {
    switch (props.variant || 'primary') {
      case 'primary':
        return {
          'background-color': '#b8860b',
          'color': 'white',
          'border': 'none'
        };
      case 'secondary':
        return {
          'background-color': '#e5dfce',
          'color': '#3d3929',
          'border': '1px solid #ddd5c0'
        };
      case 'ghost':
        return {
          'background-color': 'transparent',
          'color': '#6b6450',
          'border': 'none'
        };
      default:
        return {
          'background-color': '#b8860b',
          'color': 'white',
          'border': 'none'
        };
    }
  };
  
  return (
    <button 
      class={baseClasses}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      style={getButtonStyles()}
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement;
        if (props.variant === 'primary') {
          target.style.backgroundColor = '#cd853f';
        } else if (props.variant === 'secondary') {
          target.style.backgroundColor = '#ddd5c0';
        } else if (props.variant === 'ghost') {
          target.style.backgroundColor = '#ede9e0';
        }
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement;
        const styles = getButtonStyles();
        target.style.backgroundColor = styles['background-color'];
      }}
    >
      {props.children}
    </button>
  );
};