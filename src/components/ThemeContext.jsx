import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for theme
const ThemeContext = createContext();

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved theme in localStorage, default to light
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Computed property for if it's light mode
  const isLightMode = theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);

  // Effect to listen for system theme changes when using system theme
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Force a re-render when system theme changes
      const handleChange = () => {
        document.documentElement.setAttribute('data-update', Date.now().toString());
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Effect to update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Set specific theme
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  // Value to be provided by the context
  const value = {
    theme,
    isLightMode,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
