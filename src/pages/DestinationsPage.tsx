import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { countries } from '../data/countries';
import CountryCard from '../components/shared/CountryCard';
import CountryMap from '../components/destinations/CountryMap';
import CountryFilters from '../components/destinations/CountryFilters';
import ComparisonTool from '../components/destinations/ComparisonTool';
import { Country } from '../types';

const DestinationsPage: React.FC = () => {
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    verdict: '',
    searchTerm: '',
    minCommunityStrength: 0,
    maxCost: 5000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    filterCountries();
  }, [filters]);

  const filterCountries = () => {
    let result = [...countries];

    // Filter by verdict
    if (filters.verdict) {
      result = result.filter(country => country.verdict === filters.verdict);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(country => 
        country.name.toLowerCase().includes(searchLower) || 
        country.rules.toLowerCase().includes(searchLower) ||
        country.languages.toLowerCase().includes(searchLower)
      );
    }

    // Filter by community strength
    if (filters.minCommunityStrength > 0) {
      result = result.filter(country => country.communityStrength >= filters.minCommunityStrength);
    }

    // Filter by cost
    if (filters.maxCost < 5000) {
      result = result.filter(country => country.costOfLiving <= filters.maxCost);
    }

    setFilteredCountries(result);
  };

  const handleFilterChange = (newFilters: {
    verdict?: string;
    searchTerm?: string;
    minCommunityStrength?: number;
    maxCost?: number;
  }) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };

  const toggleCountrySelection = (countryId: string) => {
    if (selectedCountries.includes(countryId)) {
      setSelectedCountries(selectedCountries.filter(id => id !== countryId));
    } else {
      // Only allow up to 3 countries for comparison
      if (selectedCountries.length < 3) {
        setSelectedCountries([...selectedCountries, countryId]);
      }
    }
  };

  const removeFromComparison = (countryId: string) => {
    setSelectedCountries(selectedCountries.filter(id => id !== countryId));
  };

  return (
    <main className="pt-20 pb-16">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-display text-neutral-800 dark:text-white mb-4">
            EU Homeschooling Destination Guide
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Explore homeschooling feasibility across the European Union, with detailed information on regulations, language options, and local communities.
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <CountryMap />
        </div>

        {/* Filters */}
        <CountryFilters onFilterChange={handleFilterChange} />

        {/* Comparison Tool */}
        <ComparisonTool 
          selectedCountries={selectedCountries} 
          onRemoveCountry={removeFromComparison} 
        />

        {/* Country Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map(country => (
            <div key={country.id} className="relative">
              <CountryCard country={country} />
              <button
                onClick={() => toggleCountrySelection(country.id)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  selectedCountries.includes(country.id)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/80 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
                aria-label={selectedCountries.includes(country.id) ? 'Remove from comparison' : 'Add to comparison'}
                title={selectedCountries.includes(country.id) ? 'Remove from comparison' : 'Add to comparison'}
              >
                {selectedCountries.includes(country.id) ? '✓' : <Plus size={18} />}
              </button>
            </div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-neutral-600 dark:text-neutral-400">
              No countries match your current filters
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-500">
              Try adjusting your filter criteria to see more results
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DestinationsPage;