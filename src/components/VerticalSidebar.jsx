import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function VerticalSidebar() {
  const location = useLocation()

  // Function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <a href="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            {/* Logo can be added here */}
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">Materio</span>
        </a>

        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
          <i className="ri-menu-line align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {/* Dashboards */}
        <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="menu-icon tf-icons ri-home-smile-line"></i>
            <div>Dashboard</div>
          </Link>
        </li>

        {/* Layouts */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-layout-2-line"></i>
            <div>Layouts</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-4-line"></i>
                <div>Without menu</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-left-line"></i>
                <div>Vertical</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Front Pages */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-file-list-3-line"></i>
            <div>Front Pages</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="menu-icon tf-icons ri-file-line"></i>
                <div>Landing</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="menu-icon tf-icons ri-file-text-line"></i>
                <div>Pricing</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Apps & Pages</span>
        </li>

        {/* Email */}
        <li className={`menu-item ${isActive('/email') ? 'active' : ''}`}>
          <Link to="/email" className="menu-link">
            <i className="menu-icon tf-icons ri-mail-line"></i>
            <div>Email</div>
          </Link>
        </li>

        {/* Chat */}
        <li className={`menu-item ${isActive('/chat') ? 'active' : ''}`}>
          <Link to="/chat" className="menu-link">
            <i className="menu-icon tf-icons ri-message-2-line"></i>
            <div>Chat</div>
          </Link>
        </li>

        {/* Calendar */}
        <li className={`menu-item ${isActive('/calendar') ? 'active' : ''}`}>
          <Link to="/calendar" className="menu-link">
            <i className="menu-icon tf-icons ri-calendar-line"></i>
            <div>Calendar</div>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default VerticalSidebar 