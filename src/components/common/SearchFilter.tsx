import React from 'react';
import { Search, Filter, Calendar, DivideIcon as LucideIcon } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    icon?: LucideIcon;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  }[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = []
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className={`grid grid-cols-1 ${filters.length > 0 ? `md:grid-cols-${Math.min(filters.length + 1, 4)}` : ''} gap-4`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {filters.map((filter, index) => {
          const FilterIcon = filter.icon || Filter;
          return (
            <div key={index} className="flex items-center space-x-2">
              <FilterIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchFilter;