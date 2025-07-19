import React from 'react';
import { DivideIcon as LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  change, 
  changeType,
  description 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;