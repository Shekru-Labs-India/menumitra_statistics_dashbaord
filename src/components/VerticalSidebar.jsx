import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/img/company/MenuMitra_logo.png";

function VerticalSidebar() {
  const location = useLocation()
  const [isDocked, setIsDocked] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    // Set initial state for small screen detection
    if (window.Helpers) {
      setIsSmallScreen(window.Helpers.isSmallScreen());
    }

    // Initialize Helpers and Menu when component mounts
    if (window.Helpers && window.Menu) {
      // Initialize Helpers
      window.Helpers.init();
      
      // Get the layout menu element
      const layoutMenu = document.getElementById('layout-menu');
      
      // Initialize the Menu with proper configuration
      if (layoutMenu) {
        // Create a new Menu instance with appropriate options
        const menu = new window.Menu(layoutMenu, {
          orientation: 'vertical',
          closeChildren: true,
          showDropdownOnHover: true
        });
        
        // Store the menu instance for global access
        window.Helpers.mainMenu = menu;
        
        // Scroll to active menu item
        window.Helpers.scrollToActive();
        
        // Enable auto updates for responsive behavior
        window.Helpers.setAutoUpdate(true);
        
        // Check if there's a saved state in localStorage
        if (window.config && window.config.enableMenuLocalStorage) {
          try {
            const storedCollapsed = localStorage.getItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`);
            // Update the docked state based on stored preference
            if (storedCollapsed !== null) {
              setIsDocked(storedCollapsed !== "true");
              // Apply the stored state
              window.Helpers.setCollapsed(storedCollapsed === "true", false);
            } else {
              // Set initial collapsed state for desktop (not collapsed by default)
              if (!window.Helpers.isSmallScreen()) {
                window.Helpers.setCollapsed(false, false);
              }
            }
          } catch (error) {
            console.error('Error reading from localStorage:', error);
          }
        } else {
          // Set initial collapsed state for desktop if no localStorage
          if (!window.Helpers.isSmallScreen()) {
            window.Helpers.setCollapsed(false, false);
          }
        }
        
        // Toggle menu button functionality
        document.querySelectorAll('.layout-menu-toggle').forEach(el => {
          el.addEventListener('click', e => {
            e.preventDefault();
            window.Helpers.toggleCollapsed();
            setIsDocked(!window.Helpers.isCollapsed());
          });
        });
      }
    }

    // Add event listener for outside clicks
    const handleClickOutside = (event) => {
      // Only handle in mobile view
      if (window.Helpers && window.Helpers.isSmallScreen()) {
        const layoutMenu = document.getElementById('layout-menu');
        // Check if the menu is expanded and the click is outside the sidebar
        if (
          layoutMenu && 
          !layoutMenu.contains(event.target) && 
          !window.Helpers.isCollapsed() &&
          // Don't collapse when clicking on the menu toggle button
          !event.target.closest('.layout-menu-toggle')
        ) {
          // Collapse the menu
          window.Helpers.setCollapsed(true);
          setIsDocked(false);
          
          // Save state to localStorage if enabled
          if (window.config && window.config.enableMenuLocalStorage) {
            try {
              localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, "true");
              document.documentElement.setAttribute('data-menu-open', "false");
            } catch (error) {
              console.error('Error writing to localStorage:', error);
            }
          }
          
          // Trigger custom event for other components to listen
          window.dispatchEvent(new Event('layout:toggle'));
        }
      }
    };

    // Listen for window resize to update isSmallScreen state
    const handleResize = () => {
      if (window.Helpers) {
        setIsSmallScreen(window.Helpers.isSmallScreen());
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup when component unmounts
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      
      if (window.Helpers) {
        window.Helpers.setAutoUpdate(false);
      }
      
      // Destroy menu instance if exists
      const layoutMenu = document.getElementById('layout-menu');
      if (layoutMenu && layoutMenu.menuInstance) {
        layoutMenu.menuInstance.destroy();
      }
    };
  }, []);

  // Toggle sidebar docked/undocked state
  const handleDockToggle = (e) => {
    const isChecked = e.target.checked;
    setIsDocked(isChecked);
    
    if (window.Helpers) {
      window.Helpers.setCollapsed(!isChecked, true);
      
      // Save state to localStorage if enabled
      if (window.config && window.config.enableMenuLocalStorage) {
        try {
          localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, String(!isChecked));
          // Update data-menu-open attribute
          document.documentElement.setAttribute('data-menu-open', String(isChecked));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
    }
  };

  // Function to handle pin icon click
  const handlePinClick = () => {
    setIsDocked(true);
    
    if (window.Helpers) {
      window.Helpers.setCollapsed(false, true);
      
      // Save state to localStorage if enabled
      if (window.config && window.config.enableMenuLocalStorage) {
        try {
          localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, "false");
          // Update data-menu-open attribute
          document.documentElement.setAttribute('data-menu-open', "true");
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
    }
  };

  // Function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 0 50px 0 rgba(0, 0, 0, 0.1)' }} ref={sidebarRef}>
      <div className="app-brand demo py-3 px-4">
        <Link to="/" className="app-brand-link gap-2">
          <span className="app-brand-logo demo">
            <span style={{ color: "var(--bs-primary)" }}>
              <img src={logo} alt="MenuMitra Logo" style={{ width: "50px", height: "50px" }} />
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">MenuMitra</span>
        </Link>

        {/* Menu Pin Toggle - Only show on desktop (non-small screens) */}
        {!isSmallScreen && (
          <div className="menu-pin-toggle ms-auto me-1">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="dockMenu" 
              checked={isDocked} 
              onChange={handleDockToggle} 
              title="Pin/Unpin Menu"
            />
          </div>
        )}

        {/* Pin Icon - Only shows when hovering over collapsed menu on desktop */}
        {!isSmallScreen && (
          <i 
            className="" 
            onClick={handlePinClick}
            title="Pin Menu"
          ></i>
        )}

        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-1" onClick={(e) => {
          e.preventDefault();
          if (window.Helpers) {
            const newState = !window.Helpers.isCollapsed();
            window.Helpers.toggleCollapsed();
            setIsDocked(!newState);
            
            // Save state to localStorage if enabled
            if (window.config && window.config.enableMenuLocalStorage) {
              try {
                localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, String(newState));
                // Update data-menu-open attribute
                document.documentElement.setAttribute('data-menu-open', String(!newState));
              } catch (error) {
                console.error('Error writing to localStorage:', error);
              }
            }
            
            // Trigger custom event for other components to listen
            window.dispatchEvent(new Event('layout:toggle'));
          }
        }}>
          {/* <i className="ri-menu-fold-line align-middle"></i> */}
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {/* Dashboard */}
        <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="menu-icon tf-icons ri-dashboard-line text-white"></i>
            <div data-i18n="Dashboard">Home</div>
          </Link>
        </li>

       
      </ul>
    </aside>
  )
}

export default VerticalSidebar 