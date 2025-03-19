import React, { useEffect } from 'react';
import { useTheme } from './ThemeContext';

// Component to handle theme stylesheet switching
const ThemeLink = () => {
  const { isLightMode, theme } = useTheme();

  useEffect(() => {
    // Find all stylesheet links with data-theme attribute
    const themeLinks = document.querySelectorAll('link[data-theme]');
    
    // Toggle the disabled attribute based on the theme state
    themeLinks.forEach(link => {
      const isLightTheme = link.getAttribute('data-theme') === 'light';
      link.disabled = isLightTheme ? !isLightMode : isLightMode;
    });
    
    // Update body class for additional theming
    if (isLightMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    
    // Add data attribute to document for CSS targeting
    document.documentElement.setAttribute('data-theme', theme);
  }, [isLightMode, theme]); // Re-run effect when theme changes

  // This component doesn't render anything visible
  return null;
};

export default ThemeLink;
