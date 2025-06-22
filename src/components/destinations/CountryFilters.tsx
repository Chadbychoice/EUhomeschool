import React, { useState } from 'react';
import { Filter, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface CountryFiltersProps {
  onFilterChange: (filters: {
    verdict?: string;
    searchTerm?: string;
    minCommunityStrength?: number;
    maxCost?: number;
  }) => void;
}

const CountryFilters: React.FC<CountryFiltersProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    verdict: '',
    searchTerm: '',
    minCommunityStrength: 0,
    maxCost: 5000,
  });

  const handleVerdictChange = (verdict: string) => {
    const newFilters = {
      ...filters,
      verdict: filters.verdict === verdict ? '' : verdict,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCommunityStrengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      minCommunityStrength: Number(e.target.value),
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      maxCost: Number(e.target.value),
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Filter size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-medium">Filter Destinations</h3>
        </div>
        <button
          onClick={toggleExpanded}
          className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="mt-4">
        {/* Search input always visible */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
          />
        </div>

        {/* Verdict filters always visible */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleVerdictChange('green')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
              filters.verdict === 'green'
                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            <CheckCircle size={16} />
            <span>Easy</span>
          </button>

          <button
            onClick={() => handleVerdictChange('yellow')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
              filters.verdict === 'yellow'
                ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            <AlertTriangle size={16} />
            <span>Possible</span>
          </button>

          <button
            onClick={() => handleVerdictChange('red')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
              filters.verdict === 'red'
                ? 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-200'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            <XCircle size={16} />
            <span>Difficult</span>
          </button>
        </div>

        {/* Additional filters that expand/collapse */}
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div>
              <label htmlFor="communityStrength" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Minimum Community Strength
              </label>
              <select
                id="communityStrength"
                value={filters.minCommunityStrength}
                onChange={handleCommunityStrengthChange}
                className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
              >
                <option value="0">Any</option>
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★</option>
              </select>
            </div>

            <div>
              <label htmlFor="costRange" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Maximum Monthly Cost: €{filters.maxCost}
              </label>
              <input
                type="range"
                id="costRange"
                min="1500"
                max="5000"
                step="100"
                value={filters.maxCost}
                onChange={handleCostChange}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryFilters;