import React from 'react';
import Icon from '../AppIcon';

const QuickActionButton = ({ 
  label, 
  icon, 
  onClick, 
  variant = 'primary',
  size = 'default',
  disabled = false,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 elevation-3 hover:elevation-6',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 elevation-3 hover:elevation-6',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90 elevation-3 hover:elevation-6',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 elevation-1 hover:elevation-3'
  };

  const sizeStyles = {
    small: 'px-3 py-2 text-sm gap-1.5',
    default: 'px-4 py-2.5 text-sm gap-2',
    large: 'px-5 py-3 text-base gap-2.5'
  };

  const iconSizes = {
    small: 16,
    default: 18,
    large: 20
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-md font-medium
        transition-smooth active:scale-95
        ${variantStyles?.[variant]}
        ${sizeStyles?.[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={label}
    >
      {icon && (
        <Icon 
          name={icon} 
          size={iconSizes?.[size]} 
          strokeWidth={2.5}
        />
      )}
      <span className="font-medium whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};

export default QuickActionButton;