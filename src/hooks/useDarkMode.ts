import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Check if user has a preference in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('darkMode');
    
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    
    // If no preference is saved, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update the DOM when the state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};