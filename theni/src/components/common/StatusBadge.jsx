import React from 'react';
import { STATUS_LABELS } from '../../constants';

const BADGE_STYLES = {
  PLANNED: 'text-primary-container bg-surface-container',
  CONFIRMED: 'text-[#0dcaf0] bg-[#cff4fc]',
  FULL: 'text-[#ffc107] bg-[#fff3cd]',
  COMPLETED: 'text-[#198754] bg-[#d1e7dd]',
  ONGOING: 'text-[#0dcaf0] bg-[#cff4fc]',
  ACTIVE: 'text-[#1e8e3e] bg-[#e6f4ea]',
  PENDING: 'text-[#f29900] bg-[#fef7e0]',
  CANCELLED: 'text-[#ba1a1a] bg-[#ffdad6]',
  INACTIF: 'text-[#5f6368] bg-[#f1f3f4]',
  INACTIVE: 'text-[#5f6368] bg-[#f1f3f4]'
};

export default function StatusBadge({ status, uppercase = true }) {
  const label = STATUS_LABELS[status] || status;
  const style = BADGE_STYLES[status] || 'text-[#5f6368] bg-[#f1f3f4]';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-semibold ${
        uppercase ? 'uppercase' : ''
      } ${style}`}
    >
      {label}
    </span>
  );
}