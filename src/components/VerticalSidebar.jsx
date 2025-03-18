import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/img/company/MenuMitra_logo.png";
import './VerticalSidebar.css';

function VerticalSidebar() {
  const location = useLocation()
  const [isDocked, setIsDocked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [showPinButton, setShowPinButton] = useState(false)
  const sidebarRef = useRef(null)
  const hoverTimerRef = useRef(null)

  useEffect(() => {
    if (window.Helpers) {
      setIsSmallScreen(window.Helpers.isSmallScreen());
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(hoverTimerRef.current);
    };
  }, []);

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

  const isActive = (path) => {
    return location.pathname === path
  }

  const sidebarClasses = `
    layout-menu menu-vertical menu
    ${isHovered ? 'hovered' : ''}
    ${isDocked ? 'docked' : ''}
    ${isSmallScreen ? 'mobile' : ''}
  `;

  return (
    <aside 
      id="layout-menu" 
      className={sidebarClasses}
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Section */}
      <div className="app-brand">
        <Link to="/dashboard" className="app-brand-link">
          <span className="app-brand-logo">
            <img src={logo} alt="MenuMitra" width="32" />
          </span>
          <span className="app-brand-text">MenuMitra</span>
        </Link>

        {!isSmallScreen && (
          <div className="menu-pin-toggle">
            {isDocked ? (
              <button className="btn" onClick={handleUnpinClick} title="Unpin">
                <i className="ri-pushpin-fill"></i>
              </button>
            ) : showPinButton && (
              <button className="btn" onClick={handlePinClick} title="Pin">
                <i className="ri-pushpin-line"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="menu-search px-4 py-2">
        <div className="search-input-wrapper">
          <i className="ri-search-line search-icon"></i>
          <input type="text" className="form-control" placeholder="Search (Ctrl+/)" />
        </div>
      </div>

      {/* Menu Items */}
      <ul className="menu-inner">
        {/* Dashboards Section */}
        <li className="menu-header">
          <span>Dashboards</span>
        </li>
        <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="menu-icon ri-home-line"></i>
            <div>Home</div>
          </Link>
        </li>
        <li className={`menu-item ${isActive('/analytics') ? 'active' : ''}`}>
          <Link to="/analytics" className="menu-link">
            <i className="menu-icon ri-bar-chart-line"></i>
            <div>Analytics</div>
          </Link>
        </li>
        <li className={`menu-item ${isActive('/ecommerce') ? 'active' : ''}`}>
          <Link to="/ecommerce" className="menu-link">
            <i className="menu-icon ri-shopping-cart-line"></i>
            <div>eCommerce</div>
          </Link>
        </li>

        {/* Apps & Pages Section */}
        <li className="menu-header">
          <span>Apps & Pages</span>
        </li>
        <li className={`menu-item ${isActive('/email') ? 'active' : ''}`}>
          <Link to="/email" className="menu-link">
            <i className="menu-icon ri-mail-line"></i>
            <div>Email</div>
          </Link>
        </li>
        <li className={`menu-item ${isActive('/chat') ? 'active' : ''}`}>
          <Link to="/chat" className="menu-link">
            <i className="menu-icon ri-message-3-line"></i>
            <div>Chat</div>
          </Link>
        </li>
        <li className={`menu-item ${isActive('/calendar') ? 'active' : ''}`}>
          <Link to="/calendar" className="menu-link">
            <i className="menu-icon ri-calendar-line"></i>
            <div>Calendar</div>
          </Link>
        </li>
        <li className={`menu-item ${isActive('/kanban') ? 'active' : ''}`}>
          <Link to="/kanban" className="menu-link">
            <i className="menu-icon ri-layout-masonry-line"></i>
            <div>Kanban</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default VerticalSidebar; 