import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'store' | 'product' | 'order' | 'withdrawal';
  onClick?: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default', onClick }) => {
  const getStatusColor = (status: string, variant: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      default: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        rejected: 'bg-red-100 text-red-800',
        approved: 'bg-blue-100 text-blue-800',
        connected: 'bg-green-100 text-green-800',
        disconnected: 'bg-gray-100 text-gray-800',
        error: 'bg-red-100 text-red-800'
      },
      store: {
        online: 'bg-primary/20 text-primary',
        offline: 'bg-secondary/20 text-secondary'
      },
      product: {
        shopee: 'bg-tertiary/20 text-tertiary',
        tokopedia: 'bg-primary/20 text-primary',
        lazada: 'bg-secondary/20 text-secondary',
        tiktok: 'bg-quaternary/20 text-quaternary'
      },
      order: {
        completed: 'bg-primary/20 text-primary',
        pending: 'bg-secondary/20 text-secondary',
        cancelled: 'bg-quaternary/20 text-quaternary',
        processing: 'bg-tertiary/20 text-tertiary'
      },
      withdrawal: {
        completed: 'bg-primary/20 text-primary',
        pending: 'bg-secondary/20 text-secondary',
        approved: 'bg-tertiary/20 text-tertiary',
        rejected: 'bg-quaternary/20 text-quaternary'
      }
    };

    return colorMap[variant]?.[status] || colorMap.default[status] || 'bg-gray-100 text-gray-800';
  };

  const className = `px-3 py-1 rounded-full text-xs font-medium transition-all ${getStatusColor(status, variant)} ${
    onClick ? 'cursor-pointer hover:opacity-80' : ''
  }`;

  return (
    <span className={className} onClick={onClick}>
      {status}
    </span>
  );
};

export default StatusBadge;