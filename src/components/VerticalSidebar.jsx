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
      <div className="sidebar-brand">
        <Link to="/dashboard" className="sidebar-brand-link">
          <span className="sidebar-brand-logo">
            <img src={logo} alt="MenuMitra" width="32" />
          </span>
          <span className="sidebar-brand-text">MenuMitra</span>
        </Link>

        {!isSmallScreen && (
          <div className="sidebar-pin-toggle">
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

      {/* Menu Items */}
      <ul className="menu-inner">
        <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="menu-icon fa-solid fa-house text-white"></i>
            <div>Home</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default VerticalSidebar; 