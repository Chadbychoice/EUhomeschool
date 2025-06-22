import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Country } from '../../types';
import { getCountryById } from '../../data/countries';

interface ComparisonToolProps {
  selectedCountries: string[];
  onRemoveCountry: (id: string) => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ 
  selectedCountries, 
  onRemoveCountry 
}) => {
  const getCountry = (id: string): Country | undefined => {
    return getCountryById(id);
  };

  const getVerdictLabel = (verdict: string): string => {
    switch (verdict) {
      case 'green': return 'Easy';
      case 'yellow': return 'Possible but regulated';
      case 'red': return 'Basically impossible';
      default: return 'Unknown';
    }
  };

  const getVerdictClass = (verdict: string): string => {
    switch (verdict) {
      case 'green': return 'verdict-green';
      case 'yellow': return 'verdict-yellow';
      case 'red': return 'verdict-red';
      default: return '';
    }
  };

  if (selectedCountries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Country Comparison
        </h3>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {selectedCountries.length}/3 countries selected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 border-b border-neutral-200 dark:border-neutral-700"></th>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <th key={id} className="py-3 px-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                        {country?.name || 'Unknown Country'}
                      </span>
                      <button
                        onClick={() => onRemoveCountry(id)}
                        className="text-neutral-400 hover:text-error-500 dark:hover:text-error-400"
                        aria-label={`Remove ${country?.name || 'country'} from comparison`}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 font-medium text-neutral-700 dark:text-neutral-300">
                Homeschooling Status
              </td>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <td key={id} className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 text-center">
                    <div className={`inline-block px-3 py-1 rounded-full ${getVerdictClass(country?.verdict || 'unknown')}`}>
                      {getVerdictLabel(country?.verdict || 'unknown')}
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 font-medium text-neutral-700 dark:text-neutral-300">
                Cost of Living
              </td>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <td key={id} className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 text-center font-medium">
                    €{country?.costOfLiving || '?'}/month
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 font-medium text-neutral-700 dark:text-neutral-300">
                Internet Speed
              </td>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <td key={id} className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 text-center">
                    {country?.internetSpeed || '?'} Mbps
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 font-medium text-neutral-700 dark:text-neutral-300">
                Community Strength
              </td>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <td key={id} className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-700 text-center">
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i}
                          className={`text-lg ${
                            country && i < country.communityStrength 
                              ? 'text-accent-500' 
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Key Pros
              </td>
              {selectedCountries.map(id => {
                const country = getCountry(id);
                return (
                  <td key={id} className="py-4 px-4 text-center">
                    <ul className="list-disc list-inside text-left text-sm">
                      {country?.pros.slice(0, 3).map((pro, index) => (
                        <li key={index} className="text-neutral-700 dark:text-neutral-300">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTool;