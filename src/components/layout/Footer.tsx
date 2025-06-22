import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Twitter, Instagram, Facebook, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white dark:bg-neutral-950">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="text-primary-200" size={28} />
              <span className="text-xl font-bold font-display text-white">
                EUhomeschool
              </span>
            </Link>
            <p className="mt-4 text-primary-100 max-w-md">
              Your guide to homeschooling laws, local communities, and connections for digital nomad families in the EU.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-primary-200 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/destinations" className="text-primary-200 hover:text-white transition-colors">Destination Guide</Link></li>
              <li><Link to="/community" className="text-primary-200 hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2">
              <a href="mailto:info@euhomeschool.com" className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors">
                <Mail size={18} />
                <span>info@euhomeschool.com</span>
              </a>
              <Link to="/contact" className="inline-block mt-4 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            &copy; {currentYear} EUhomeschool.com. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap space-x-4 text-sm text-primary-200">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <div className="flex items-center space-x-1 mt-2 md:mt-0">
              <span>Made with</span>
              <Heart size={14} className="text-accent-400" />
              <span>for digital nomad families</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;