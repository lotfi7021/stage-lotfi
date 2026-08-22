import React from 'react';
import Icon from './Icon';

const VARIANTS = {
  primary: 'bg-primary-container text-on-primary hover:bg-[#004494]',
  secondary: 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low',
  outline: 'bg-surface border border-primary-container text-primary-container hover:bg-surface-container-low',
  ghost: 'text-on-surface-variant hover:bg-surface-container-low'
};

export default function Button({
  children,
  icon,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-label-md font-medium transition-colors active:opacity-80 cursor-pointer ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}