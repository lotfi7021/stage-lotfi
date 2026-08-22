import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-[#E9ECEF] ambient-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-md text-on-background m-0">{title}</h2>
        {subtitle && <p className="text-body-md text-on-surface-variant m-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}