import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Country, CountryVerdict } from '../../types';

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const getVerdictIcon = (verdict: CountryVerdict) => {
    switch (verdict) {
      case 'green':
        return <CheckCircle className="text-success-500\" size={20} />;
      case 'yellow':
        return <AlertTriangle className="text-warning-500" size={20} />;
      case 'red':
        return <XCircle className="text-error-500" size={20} />;
      default:
        return null;
    }
  };

  const getVerdictText = (verdict: CountryVerdict) => {
    switch (verdict) {
      case 'green':
        return 'Easy';
      case 'yellow':
        return 'Possible but regulated';
      case 'red':
        return 'Basically impossible';
      default:
        return '';
    }
  };

  const getVerdictClass = (verdict: CountryVerdict) => {
    switch (verdict) {
      case 'green':
        return 'verdict-green';
      case 'yellow':
        return 'verdict-yellow';
      case 'red':
        return 'verdict-red';
      default:
        return '';
    }
  };

  return (
    <div className="card card-hover">
      <Link to={`/destinations/${country.id}`} className="block">
        <div className="h-48 overflow-hidden">
          <img 
            src={country.headerImage} 
            alt={country.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold font-display mb-2">{country.name}</h3>
          
          <div className={`px-3 py-2 inline-flex items-center space-x-2 rounded-md mb-3 ${getVerdictClass(country.verdict)}`}>
            {getVerdictIcon(country.verdict)}
            <span className="font-medium">{getVerdictText(country.verdict)}</span>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Cost of Living:</span>
              <span className="font-medium">€{country.costOfLiving}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Internet Speed:</span>
              <span className="font-medium">{country.internetSpeed} Mbps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Community Strength:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < country.communityStrength ? 'text-accent-500' : 'text-neutral-300 dark:text-neutral-700'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CountryCard;