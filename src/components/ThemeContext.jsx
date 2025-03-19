import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for theme
const ThemeContext = createContext();

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Function to dynamically load CSS files
const loadThemeStylesheet = (isDark) => {
  // Remove any existing theme stylesheets
  document.querySelectorAll('link[data-theme]').forEach(link => link.remove());

  if (isDark) {
    // Create dark theme stylesheet links
    const coreDarkLink = document.createElement('link');
    coreDarkLink.rel = 'stylesheet';
    coreDarkLink.href = '/src/assets/css/core-dark.css';
    coreDarkLink.setAttribute('data-theme', 'core');
    
    const themeDarkLink = document.createElement('link');
    themeDarkLink.rel = 'stylesheet';
    themeDarkLink.href = '/src/assets/css/theme-default-dark.css';
    themeDarkLink.setAttribute('data-theme', 'theme');
    
    document.head.appendChild(coreDarkLink);
    document.head.appendChild(themeDarkLink);
  } else {
    // For light theme, we don't need to add links since they're loaded in App.jsx
    // But we'll add them here for consistency
    const coreLink = document.createElement('link');
    coreLink.rel = 'stylesheet';
    coreLink.href = '/src/assets/css/core.css';
    coreLink.setAttribute('data-theme', 'core');
    
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = '/src/assets/css/theme-default.css';
    themeLink.setAttribute('data-theme', 'theme');
    
    document.head.appendChild(coreLink);
    document.head.appendChild(themeLink);
  }
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved theme in localStorage, default to light
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Computed property for if it's light mode
  const isLightMode = theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);

  // Apply theme classes and CSS files
  useEffect(() => {
    // Apply theme class to document (light-style or dark-style)
    document.documentElement.classList.remove('light-style', 'dark-style');
    
    let isDark = false;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-style');
      isDark = true;
    } else if (theme === 'light') {
      document.documentElement.classList.add('light-style');
      isDark = false;
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark-style' : 'light-style');
      isDark = prefersDark;
    }
    
    // Load appropriate CSS files
    loadThemeStylesheet(isDark);
  }, [theme]);

  // Effect to listen for system theme changes when using system theme
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Update theme when system preference changes
      const handleChange = () => {
        const prefersDark = mediaQuery.matches;
        document.documentElement.classList.remove('light-style', 'dark-style');
        document.documentElement.classList.add(prefersDark ? 'dark-style' : 'light-style');
        
        // Update CSS files
        loadThemeStylesheet(prefersDark);
        
        // Force a re-render
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
