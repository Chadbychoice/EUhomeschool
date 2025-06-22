import React from 'react';
import { Link } from 'react-router-dom';
import { FeaturedDestination } from '../../types';

interface FeaturedDestinationCardProps {
  destination: FeaturedDestination;
}

const FeaturedDestinationCard: React.FC<FeaturedDestinationCardProps> = ({ destination }) => {
  return (
    <Link to={`/destinations/${destination.id}`} className="block">
      <div className="card overflow-hidden h-full card-hover">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white font-display">
            {destination.name}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {destination.teaser}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedDestinationCard;