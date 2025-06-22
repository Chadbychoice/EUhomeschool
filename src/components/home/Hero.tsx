import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/60"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-white pt-20">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Homeschool Freely Across Europe with EUhomeschool.com
          </motion.h1>
          
          <motion.p 
            className="text-xl text-primary-50 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your guide to homeschooling laws, local communities, and connections for digital nomad families in the EU.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/destinations" 
              className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center space-x-2 shadow-lg"
            >
              <MapPin size={18} />
              <span>Explore EU Destinations</span>
            </Link>
            
            <Link 
              to="/community" 
              className="btn bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 flex items-center justify-center space-x-2"
            >
              <Users size={18} />
              <span>Join Our Community</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent z-10"></div>
    </div>
  );
};

export default Hero;