import React from 'react';

export default function Icon({ name, fill = false, size, className = '', ...props }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${fill ? 'fill' : ''} ${className}`}
      style={size ? { fontSize: size } : undefined}
      {...props}
    >
      {name}
    </span>
  );
}