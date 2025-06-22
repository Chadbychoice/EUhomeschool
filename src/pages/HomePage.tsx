import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import Quiz from '../components/home/Quiz';
import Newsletter from '../components/home/Newsletter';

const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Hero />
      <FeaturedDestinations />
      <Quiz />
      <Newsletter />
    </main>
  );
};

export default HomePage;