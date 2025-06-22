import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FeaturedDestinationCard from '../shared/FeaturedDestinationCard';
import { featuredDestinations } from '../../data/featuredDestinations';
import { MapPin } from 'lucide-react';

const FeaturedDestinations: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
    customPaging: () => (
      <div className="carousel-dot"></div>
    ),
    dotsClass: 'slick-dots custom-dots'
  };

  return (
    <section className="section bg-neutral-50 dark:bg-neutral-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin size={24} className="text-primary-500" />
            <h2 className="text-3xl font-bold font-display text-neutral-800 dark:text-white">
              Featured Destinations
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Discover the best European countries for homeschooling your children while living the digital nomad lifestyle.
          </p>
        </div>

        <Slider {...settings} className="featured-slider">
          {featuredDestinations.map((destination) => (
            <div key={destination.id} className="px-3 pb-8">
              <FeaturedDestinationCard destination={destination} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedDestinations;