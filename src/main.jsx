import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Import vendor scripts through our utilities bundle
import { initializeHelpers } from './utils/vendor.js'

// Initialize Helpers when available
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme based on user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme class to document
  document.documentElement.classList.add(prefersDark ? 'dark-style' : 'light-style');
  
  // Initialize menu state from localStorage if available
  if (window.templateName) {
    try {
      const storedCollapsed = localStorage.getItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`);
      if (storedCollapsed === 'true') {
        document.documentElement.setAttribute('data-menu-open', 'false');
      } else {
        document.documentElement.setAttribute('data-menu-open', 'true');
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  
  // Initialize Helpers if available
  if (window.Helpers) {
    window.Helpers.init();
    // Initialize additional helpers
    initializeHelpers();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
