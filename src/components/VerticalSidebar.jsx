import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/img/company/MenuMitra_logo.png";
import './VerticalSidebar.css';

function VerticalSidebar() {
  const location = useLocation()
  const [isDocked, setIsDocked] = useState(() => {
    // Initialize from localStorage, default to false if not found
    return localStorage.getItem('sidebar_pinned') === 'true';
  });
  const [isHovered, setIsHovered] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [showPinButton, setShowPinButton] = useState(false)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)
  const sidebarRef = useRef(null)
  const hoverTimerRef = useRef(null)

  useEffect(() => {
    if (window.Helpers) {
      setIsSmallScreen(window.Helpers.isSmallScreen());
    }

    // Check if menu is expanded on mobile
    const isExpanded = document.documentElement.classList.contains('layout-menu-expanded');
    setIsMobileExpanded(isExpanded);

    window.addEventListener('resize', handleResize);
    
    // Listen for menu toggle events from other components
    window.addEventListener('layout:toggle', handleLayoutToggle);
    
    // Add layout-menu-unpinned class when not docked
    updateLayoutMenuUnpinnedClass(isDocked);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('layout:toggle', handleLayoutToggle);
      clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Add useEffect to update class when isDocked changes
  useEffect(() => {
    updateLayoutMenuUnpinnedClass(isDocked);
    // Save to localStorage whenever isDocked changes
    localStorage.setItem('sidebar_pinned', isDocked.toString());
  }, [isDocked]);

  const updateLayoutMenuUnpinnedClass = (docked) => {
    if (docked) {
      document.body.classList.remove('layout-menu-unpinned');
    } else {
      document.body.classList.add('layout-menu-unpinned');
    }
  };

  const handleLayoutToggle = () => {
    const isExpanded = document.documentElement.classList.contains('layout-menu-expanded');
    setIsMobileExpanded(isExpanded);
  };

  const handleResize = () => {
    if (window.Helpers) {
      setIsSmallScreen(window.Helpers.isSmallScreen());
    }
  };

  const handleMouseEnter = () => {
    if (!isDocked && !isSmallScreen) {
      clearTimeout(hoverTimerRef.current);
      setIsHovered(true);
      setShowPinButton(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDocked) {
      hoverTimerRef.current = setTimeout(() => {
        setIsHovered(false);
        setShowPinButton(false);
      }, 300);
    }
  };

  const handlePinClick = () => {
    setIsDocked(true);
    setShowPinButton(false);
  };

  const handleUnpinClick = () => {
    setIsDocked(false);
    setIsHovered(false);
  };

  const handleOverlayClick = () => {
    if (isSmallScreen && isMobileExpanded) {
      // Toggle menu closed
      if (window.Helpers) {
        window.Helpers.toggleCollapsed();
        setIsMobileExpanded(false);
      }
    }
  };

  const isActive = (path) => {
    return location.pathname === path
  }

  const sidebarClasses = `
    layout-menu menu-vertical menu
    ${isHovered ? 'hovered' : ''}
    ${isDocked ? 'docked' : ''}
    ${isSmallScreen ? 'mobile' : ''}
    ${isSmallScreen && isMobileExpanded ? 'expanded' : ''}
  `;

  return (
    <>
      <aside 
        id="layout-menu" 
        className={sidebarClasses}
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo Section */}
        <div className="sidebar-brand">
          <Link to="/dashboard" className="sidebar-brand-link">
            <span className="sidebar-brand-logo">
              <img src={logo} alt="MenuMitra" width="32" />
            </span>
            <span className="sidebar-brand-text mobile-visible">MenuMitra</span>
          </Link>

          {!isSmallScreen && (
            <div className="sidebar-pin-toggle">
              {isDocked ? (
                <button className="btn" onClick={handleUnpinClick} title="Unpin">
                  <i className="fas fa-thumbtack"></i>
                </button>
              ) : showPinButton && (
                <button className="btn" onClick={handlePinClick} title="Pin">
                  <i className="fas fa-thumbtack"></i>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <ul className="menu-inner">
          <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <Link to="/dashboard" className="menu-link">
              <i className="menu-icon fa-solid fa-house text-dark"></i>
              <div className="d-block text-black overflow-hidden w-100">Home</div>
            </Link>
          </li>
          {/* <li className="menu-item ">
            <Link to="/compare-outlets" className="menu-link">
              <i className="menu-icon fa-solid fa-code-compare text-dark"></i>
              <div className="d-block text-truncate overflow-hidden w-100">Compare Outlets</div>
            </Link>
          </li> */}
        </ul>

      </aside>
      
      {/* Overlay for mobile - only shown when menu is expanded on mobile */}
      {isSmallScreen && isMobileExpanded && (
        <div 
          className="layout-overlay" 
          onClick={handleOverlayClick}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}

export default VerticalSidebar; 