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
            <span style={{ color: "var(--bs-primary)" }}>
              <svg width="30" height="24" viewBox="0 0 250 196" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.3002 1.25469L56.655 28.6432C59.0349 30.1128 60.4839 32.711 60.4839 35.5089V160.63C60.4839 163.468 58.9941 166.097 56.5603 167.553L12.2055 194.107C8.3836 196.395 3.43136 195.15 1.14435 191.327C0.395485 190.075 0 188.643 0 187.184V8.12039C0 3.66447 3.61061 0.0522461 8.06452 0.0522461C9.56056 0.0522461 11.0271 0.468577 12.3002 1.25469Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M237.721 1.18923L125 70.3075V136.87L250 65.2465V8.06814C250 3.61223 246.389 0 241.935 0C240.448 0 238.99 0.411583 237.721 1.18923Z" fill="currentColor" />
              </svg>
            </span>
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
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-home-smile-line"></i>
            <div>Dashboards</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/dashboard/crm" className="menu-link">
                <i className="menu-icon tf-icons ri-computer-line"></i>
                <div>CRM</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/dashboard/analytics" className="menu-link">
                <i className="menu-icon tf-icons ri-bar-chart-line"></i>
                <div>Analytics</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/dashboard/ecommerce" className="menu-link">
                <i className="menu-icon tf-icons ri-shopping-cart-2-line"></i>
                <div>eCommerce</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/dashboard/logistics" className="menu-link">
                <i className="menu-icon tf-icons ri-truck-line"></i>
                <div>Logistics</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/dashboard/academy" className="menu-link">
                <i className="menu-icon tf-icons ri-book-open-line"></i>
                <div>Academy</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Layouts */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-layout-2-line"></i>
            <div>Layouts</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/layouts/without-menu" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-4-line"></i>
                <div>Without menu</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/layouts/vertical" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-left-line"></i>
                <div>Vertical</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/layouts/fluid" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-top-line"></i>
                <div>Fluid</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/layouts/container" className="menu-link">
                <i className="menu-icon tf-icons ri-layout-top-2-line"></i>
                <div>Container</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/layouts/blank" className="menu-link">
                <i className="menu-icon tf-icons ri-square-line"></i>
                <div>Blank</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Apps & Pages Header */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Apps & Pages</span>
        </li>

        {/* Apps */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-mail-open-line"></i>
            <div>Apps</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/app/email" className="menu-link">
                <i className="menu-icon tf-icons ri-mail-line"></i>
                <div>Email</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/app/chat" className="menu-link">
                <i className="menu-icon tf-icons ri-message-line"></i>
                <div>Chat</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/app/calendar" className="menu-link">
                <i className="menu-icon tf-icons ri-calendar-line"></i>
                <div>Calendar</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/app/kanban" className="menu-link">
                <i className="menu-icon tf-icons ri-drag-drop-line"></i>
                <div>Kanban</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Pages */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-article-line"></i>
            <div>Pages</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/pages/user-profile" className="menu-link">
                <i className="menu-icon tf-icons ri-user-line"></i>
                <div>User Profile</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/pages/account-settings" className="menu-link">
                <i className="menu-icon tf-icons ri-settings-2-line"></i>
                <div>Account Settings</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Components Header */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Components</span>
        </li>

        {/* UI Elements */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-pantone-line"></i>
            <div>UI Elements</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/ui/buttons" className="menu-link">
                <i className="menu-icon tf-icons ri-circle-line"></i>
                <div>Buttons</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/ui/cards" className="menu-link">
                <i className="menu-icon tf-icons ri-circle-line"></i>
                <div>Cards</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Forms */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-pages-line"></i>
            <div>Forms</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/forms/basic" className="menu-link">
                <i className="menu-icon tf-icons ri-circle-line"></i>
                <div>Basic Forms</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Tables */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-table-line"></i>
            <div>Tables</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/tables/basic" className="menu-link">
                <i className="menu-icon tf-icons ri-circle-line"></i>
                <div>Basic Tables</div>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  )
}

export default VerticalSidebar 