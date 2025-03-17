import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/img/avatars/1.png'
import 'animate.css'

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [outletId, setOutletId] = useState('');
  const [storedRole, setStoredRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if menu is collapsed on initial load
    if (window.Helpers) {
      setIsMenuCollapsed(window.Helpers.isCollapsed());
    }
    
    // Listen for menu state changes
    const handleMenuToggle = () => {
      if (window.Helpers) {
        setIsMenuCollapsed(window.Helpers.isCollapsed());
      }
    };
    
    // Add listener for custom event
    window.addEventListener('layout:toggle', handleMenuToggle);
    
    return () => {
      window.removeEventListener('layout:toggle', handleMenuToggle);
    };
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('user_name');
    const storedOutletId = localStorage.getItem('outlet_id');
    const storedRole = localStorage.getItem('role');

    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    if (storedOutletId) {
      setOutletId(storedOutletId);
    }
    if (storedRole) {
      setStoredRole(storedRole);
    }
  }, []);

  const handleOutletSelect = (outletName) => {
    const truncatedName = truncateText(outletName, 20);
    setSelectedOutlet(truncatedName);
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('outlet_id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('owner_id');
    localStorage.removeItem('role');
    
    // Navigate to login page
    navigate('/login');
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    if (window.Helpers) {
      const newState = !window.Helpers.isCollapsed();
      window.Helpers.toggleCollapsed();
      
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
      
      setIsMenuCollapsed(newState);
    }
  };

  // Update the outlets array to include location and status information
  const outlets = [
    { name: 'Pune', location: 'Swargate', status: 'open' },
    { name: 'Mumbai', location: 'Andheri', status: 'open' },
    { name: 'Delhi', location: 'Connaught Place', status: 'closed' },
    { name: 'Chennai', location: 'T Nagar', status: 'open' },
    { name: 'Goa', location: 'Panjim', status: 'closed' }
  ];

  // Utility function to truncate text
  const truncateText = (text, maxLength, maxWords = 3) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text; // No truncation for maxWords or fewer words
    let truncated = '';
    for (let word of words) {
      if ((truncated + word).length > maxLength) break;
      truncated += word + ' ';
    }
    return truncated.trim() + '...';
  };

  return (
    <div>
      <nav
        className="layout-navbar navbar navbar-expand-xl align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div className="container-xxl">
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
            <a
              className="nav-item nav-link px-0 me-xl-6"
              href="javascript:void(0)"
              onClick={toggleMenu}
            >
              <i className={`fas fa-${isMenuCollapsed ? "bars" : "times"}`} />
            </a>
          </div>
          <div
            className="navbar-nav-right d-flex align-items-center"
            id="navbar-collapse"
          >
            {/* Outlet Selector Dropdown */}
            <div className="navbar-nav flex-row">
              <li className="nav-item dropdown me-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-store me-2"></i>
                  {selectedOutlet || "Select Outlet"}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <div className="px-3 py-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search outlets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {outlets.map((outlet) => (
                    <li key={outlet.name}>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        onClick={() => handleOutletSelect(outlet.name)}
                      >
                        <i className="fas fa-store me-2"></i>
                        <b>{outlet.name}</b>

                        <div className="text-end">
                          <span class="mx-2 badge bg-label-primary rounded-pill">
                            {outlet.location}
                          </span>
                          {outlet.status === "open" ? (
                            <span className="mx-2 badge bg-label-success rounded-pill">
                              Open
                            </span>
                          ) : (
                            <span className="mx-2 badge bg-label-danger rounded-pill">
                              Closed
                            </span>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </div>

            {/* Right aligned items */}
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Theme Mode */}
              {/* <li className="nav-item dropdown-style-switcher dropdown me-3">
              <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-sun fa-lg" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-theme="light"
                    >
                      <span className="align-middle">
                        <i className="fas fa-sun fa-lg me-3" />
                        Light
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-theme="dark"
                    >
                      <span className="align-middle">
                        <i className="fas fa-moon fa-lg me-3" />
                        Dark
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                href="javascript:void(0);"
                      data-theme="system"
              >
                      <span className="align-middle">
                        <i className="fas fa-desktop fa-lg me-3" />
                        System
                      </span>
              </a>
                  </li>
                </ul>
            </li> */}

              {/* User Profile */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a
                  className="nav-link dropdown-toggle hide-arrow d-flex align-items-center"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <div className="flex-grow-1 me-3 text-end">
                    <h6 className="mb-0 small">{userName}</h6>
                    <small className="text-muted">
                      {storedRole.toUpperCase()}
                    </small>
                  </div>
                  <div className="avatar ms-2">
                    <img
                      src={img}
                      alt=""
                      className="w-px-40 h-auto rounded-circle"
                    />
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end mt-3 py-2">
                  <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-account.html"
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-2">
                          <div className="avatar">
                            <img
                              src={img}
                              alt=""
                              className="w-px-40 h-auto rounded-circle"
                            />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 small">{userName}</h6>
                          <small className="text-muted">
                            {storedRole.toUpperCase()}
                          </small>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="far fa-user fa-lg me-2" />
                      <span className="align-middle">My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-account.html"
                    >
                      <i className="fas fa-tasks fa-lg me-2" />
                      <span className="align-middle">My activity</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-account.html"
                    >
                      <i className="fas fa-cog fa-lg me-2" />
                      <span className="align-middle">Settings</span>
                    </a>
                  </li>
                  {/* <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-billing.html"
                    >
                      <span className="d-flex align-items-center align-middle">
                        <i className="far fa-file-alt fa-lg me-2" />
                        <span className="flex-grow-1 align-middle">
                          Billing
                        </span>
                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger h-px-20 d-flex align-items-center justify-content-center">
                          4
                        </span>
                      </span>
                    </a>
                  </li> */}
                  <li>
                    <div className="dropdown-divider" />
                  </li>

                  <li>
                    <div className="d-grid px-4 pt-2 pb-1">
                      <button
                        className="btn btn-danger d-flex align-items-center justify-content-center"
                        onClick={handleLogout}
                      >
                        <small className="align-middle">Logout</small>
                        <i className="fas fa-sign-out-alt fa-sm ms-2" />
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* Search Small Screens */}
          <div className="navbar-search-wrapper search-input-wrapper container-xxl d-none">
            <input
              type="text"
              className="form-control search-input  border-0"
              placeholder="Search outlet"
              aria-label="Search outlet"
            />
            <i className="fas fa-times search-toggler cursor-pointer" />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header