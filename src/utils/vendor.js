/**
 * Vendor scripts bundler
 * This file imports all vendor scripts so they're properly processed by Vite
 */

// Import vendor scripts
import '../assets/vendor/js/helpers.js';
import '../assets/vendor/js/menu.js';

// Export utilities for use in the application
export const initializeHelpers = () => {
  if (window.Helpers) {
    // Initialize menu
    window.Helpers.initSidebarToggle();
    
    // Set auto update
    window.Helpers.setAutoUpdate(true);
    
    // Initialize other helpers
    window.Helpers.initPasswordToggle();
    window.Helpers.initCustomOptionCheck();
  }
}; 