import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/img/avatars/1.png'
import 'animate.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDashboard } from '../context/DashboardContext'
import { apiEndpoint } from '../config/menuMitraConfig'

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [outletId, setOutletId] = useState('');
  const [storedRole, setStoredRole] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState('0 seconds ago');
  const [startTime, setStartTime] = useState(new Date());
  const [isRotating, setIsRotating] = useState(false);
  const [selectOutletError, setSelectOutletError] = useState(null);
  const [selectedOutletData, setSelectedOutletData] = useState(null);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [quickFilters] = useState([
    
  ]);
  const navigate = useNavigate();
  
  // Get refreshDashboard from context
  const { refreshDashboard } = useDashboard();

  // Function to show toast notifications
  const showToast = (message, type = 'error') => {
    const options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored", // Colored theme matches Materio's look
      className: "materio-toast",
      style: {
        borderRadius: '0.5rem',
        boxShadow: '0 0.25rem 1rem rgba(161, 172, 184, 0.45)'
      }
    };

    switch(type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'error':
      default:
        toast.error(message, options);
        break;
    }
  };

  // Fetch outlets from API
  const fetchOutlets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userId = localStorage.getItem('user_id');
      const accessToken = localStorage.getItem('access');
      const storedOutletId = localStorage.getItem('outlet_id');
      
      if (!userId || !accessToken) {
        setError('Authentication failed. Please login again.');
        return;
      }

      const response = await fetch(`https://menusmitra.xyz/common_api/get_outlet_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          owner_id: parseInt(userId)
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.st === 1) {
        const transformedOutlets = data.outlet_list.map(outlet => ({
          name: outlet.name,
          location: outlet.address,
          status: outlet.is_open ? 'open' : 'closed',
          outlet_id: outlet.outlet_id,
          outlet_status: outlet.outlet_status
        }));
        
        setOutlets(transformedOutlets);
        
        // If there's a stored outlet_id, update selected outlet data
        if (storedOutletId) {
          const matchingOutlet = transformedOutlets.find(o => o.outlet_id.toString() === storedOutletId);
          if (matchingOutlet) {
            const truncatedName = truncateText(matchingOutlet.name, 20);
            setSelectedOutlet(truncatedName);
            setOutletId(matchingOutlet.outlet_id.toString());
            setSelectedOutletData(matchingOutlet);
          }
        }
      } else {
        setError(data.msg || 'Failed to fetch outlets');
      }
    } catch (err) {
      console.error('Error fetching outlets:', err);
      setError('Failed to connect to server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

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

  const handleOutletSelect = async (outlet) => {
    try {
      const currentOutletId = localStorage.getItem('outlet_id');
      if (currentOutletId && currentOutletId === outlet.outlet_id.toString()) {
        const truncatedName = truncateText(outlet.name, 20);
        setSelectedOutlet(truncatedName);
        setOutletId(outlet.outlet_id.toString());
        setSelectedOutletData({
          ...outlet,
          outlet_status: outlet.outlet_status
        });
        return;
      }
      
      setIsLoading(true);
      
      const truncatedName = truncateText(outlet.name, 20);
      setSelectedOutlet(truncatedName);
      setOutletId(outlet.outlet_id.toString());
      setSelectedOutletData({
        ...outlet,
        outlet_status: outlet.outlet_status
      });
      
      localStorage.setItem('outlet_id', outlet.outlet_id.toString());
      
      showToast(`Outlet "${outlet.name}" selected successfully!`, 'success');
      
      refreshDashboard();
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
      
    } catch (err) {
      console.error('Error selecting outlet:', err);
      showToast("Failed to select outlet. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('outlet_id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('owner_id');
    localStorage.removeItem('role');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('fcm_token');
    
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
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }

      // For mobile: toggle layout-menu-expanded class
      if (window.Helpers.isSmallScreen()) {
        if (newState) {
          // Adding this class will show the sidebar overlay
          document.documentElement.classList.remove('layout-menu-expanded');
        } else {
          // Removing this class will hide the sidebar overlay
          document.documentElement.classList.add('layout-menu-expanded');
        }
        
        // Update data-menu-open attribute
        document.documentElement.setAttribute('data-menu-open', String(!newState));
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
      
      setIsMenuCollapsed(newState);
    }
  };

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

  // Add this new function to format time
  const formatTimeElapsed = (startTime, currentTime) => {
    const seconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes === 1 ? '' : ''} ago`;
    } else {
      return `${seconds} sec${seconds === 1 ? '' : ''} ago`;
    }
  };

  // Add this new useEffect for time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setTimeElapsed(formatTimeElapsed(startTime, currentTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Add refresh function with rotation
  const handleRefresh = () => {
    setIsRotating(true);
    setStartTime(new Date());
    
    // Show rotating animation for a moment before reload
    setTimeout(() => {
      // Reload the page - simplest way to reset all filters and get fresh data
      window.location.reload();
    }, 500); // Shorter timeout so the reload happens during the animation
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div>
      {/* Add custom CSS for React-Toastify to match Materio */}
      <style>
        {`
          /* Custom styling for toasts to match Materio theme */
          .Toastify__toast-theme--colored.Toastify__toast--success {
            background-color: #28c76f !important;
          }
          .Toastify__toast-theme--colored.Toastify__toast--error {
            background-color: #ea5455 !important;
          }
          .Toastify__toast-theme--colored.Toastify__toast--warning {
            background-color: #ff9f43 !important;
          }
          .Toastify__toast-theme--colored.Toastify__toast--info {
            background-color: #00cfe8 !important;
          }
          .Toastify__progress-bar {
            height: 3px !important;
          }
          .materio-toast {
            font-family: inherit;
          }
          .inactive-outlet-banner {
            background-color: #9747FF;
            color: white;
            text-align: center;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            width: 100%;
          }
          .outlet-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050;
            padding: 1rem;
          }
          
          .outlet-modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalFadeIn 0.3s ease-out;
          }
          
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            .outlet-modal-content {
              width: 95%;
              max-height: 95vh;
            }

            .outlet-modal {
              padding: 0.5rem;
            }

            .outlet-modal-header {
              padding: 1rem;
            }

            .outlet-modal-body {
              padding: 1rem;
            }

            .outlet-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
              padding: 0.75rem;
            }

            .outlet-meta {
              width: 100%;
              justify-content: space-between;
              margin-left: 0;
            }

            .outlet-info {
              width: 100%;
            }

            .outlet-name {
              font-size: 0.9rem;
            }

            .outlet-location {
              font-size: 0.8rem;
            }

            .outlet-id {
              font-size: 0.75rem;
            }

            .outlet-status {
              font-size: 0.7rem;
              padding: 0.2rem 0.4rem;
            }
          }

          @media (max-width: 480px) {
            .outlet-modal-content {
              width: 100%;
              height: 100%;
              max-height: 100vh;
              border-radius: 0;
            }

            .outlet-modal {
              padding: 0;
            }

            .quick-filters {
              padding: 0.5rem;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }

            .quick-filters::-webkit-scrollbar {
              display: none;
            }

            .outlet-search input {
              font-size: 0.9rem;
              padding: 0.5rem 1rem 0.5rem 2rem;
            }
          }
          
          .outlet-modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
          }
          
          .outlet-modal-body {
            padding: 1.5rem;
          }
          
          .outlet-search {
            position: relative;
            margin-bottom: 1rem;
            position: sticky;
            top: 72px;
            background: white;
            z-index: 1;
            padding: 0.5rem 0;
          }
          
          .outlet-search input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
          }
          
          .outlet-search i {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #566a7f;
          }
          
          .outlet-search .clear-btn {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: none;
            color: #566a7f;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
          }
          
          .quick-filters {
            display: flex;
            flex-wrap: nowrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            padding: 0.75rem;
            background: #f8f9fa;
            border-radius: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            position: sticky;
            top: 130px;
            z-index: 1;
          }
          
          .quick-filter {
            padding: 0.5rem 1rem;
            background: white;
            border-radius: 20px;
            border: 1px solid #e9ecef;
            color: #566a7f;
            cursor: pointer;
            white-space: nowrap;
            font-size: 0.875rem;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }

          .quick-filter:hover {
            background: #f8f9fa;
            border-color: #566a7f;
          }
          
          .outlet-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .outlet-item {
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
            cursor: pointer;
            gap: 1rem;
            transition: background-color 0.2s ease;
          }
          
          .outlet-item:hover {
            background: #f8f9fa;
          }
          
          .outlet-icon {
            color: #566a7f;
            flex-shrink: 0;
            font-size: 1.2rem;
          }

          .outlet-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            min-width: 0;
          }

          .outlet-name {
            font-weight: 500;
            color: #566a7f;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .outlet-location {
            font-size: 0.875rem;
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .outlet-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-left: auto;
            flex-shrink: 0;
          }
          
          .outlet-id {
            color: #999;
            font-size: 0.875rem;
          }

          .outlet-status {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-weight: 500;
          }

          .status-open {
            background-color: #28c76f1a;
            color: #28c76f;
          }

          .status-closed {
            background-color: #ea54551a;
            color: #ea5455;
          }
        `}
      </style>

      {/* Add ToastContainer component at the root level */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <nav
        className="layout-navbar navbar navbar-expand-xl align-items-center bg-navbar-theme"
        id="layout-navbar"
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
          position: "relative",
          zIndex: 1000,
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
          marginBottom:
            selectedOutletData?.outlet_status === false ? "0" : "1.5rem",
        }}
      >
        <style>
          {`
            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            .rotate-animation {
              animation: rotate 1s linear;
            }
          `}
        </style>
        <div
          className="container-xxl"
          style={{
            padding: "0 1.5rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
            <a
              className="nav-item nav-link px-0 me-xl-6"
              href="javascript:void(0)"
              onClick={toggleMenu}
              style={{ padding: "0.75rem" }}
            >
              <i className={`fas fa-${isMenuCollapsed ? "bars" : "times"}`} />
            </a>
          </div>
          <div
            className="navbar-nav-right d-flex align-items-center"
            id="navbar-collapse"
            style={{ padding: "0.5rem 0" }}
          >
            {/* Outlet Selector Dropdown */}
            <div className="navbar-nav flex-row">
              <li className="nav-item dropdown me-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 600,
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px",
                  }}
                  type="button"
                  onClick={() => setShowOutletModal(true)}
                >
                  <i className="fas fa-store me-2"></i>
                  {selectedOutlet || "Select Outlet"}
                </button>
              </li>
              {/* <li className="nav-item me-3">
                <Link 
                  to="/compare-outlets" 
                  className="btn btn-primary d-none d-md-flex align-items-center"
                  style={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    boxShadow: 'rgba(105, 108, 255, 0.4) 0px 2px 4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className="fas fa-code-compare me-2"></i>
                  Compare Outlets
                </Link>
              </li> */}
            </div>

            {/* Right aligned items */}
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Updated Time */}
              <li className="nav-item me-3 mb-4">
                <div className="d-flex flex-column align-items-start">
                  <button
                    className="btn btn-icon btn-sm btn-ghost-secondary mb-0"
                    onClick={handleRefresh}
                    style={{ padding: "4px" }}
                  >
                    <i
                      className={`fas fa-sync-alt ${
                        isRotating ? "rotate-animation" : ""
                      }`}
                    ></i>
                  </button>
                  <small className="text-muted">
                    Last updated {timeElapsed}
                  </small>
                </div>
              </li>

              {/* User Profile */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a
                  className="nav-link dropdown-toggle hide-arrow d-flex align-items-center"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <div className="flex-grow-1 me-3 text-end">
                    <h6 className="mb-0 small fw-bold">{userName}</h6>
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
                    <Link className="dropdown-item" to="/profile">
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
                    </Link>
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
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="fas fa-tasks fa-lg me-2" />
                      <span className="align-middle">My activity</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="fas fa-cog fa-lg me-2" />
                      <span className="align-middle">Settings</span>
                    </Link>
                  </li>
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

      {/* Outlet Selection Modal */}
      {showOutletModal && (
        <div className="outlet-modal">
          <div className="outlet-modal-content">
            <div className="outlet-modal-header">
              <h5 className="mb-0">Select Outlet</h5>
              <button
                className="btn-close"
                onClick={() => setShowOutletModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="outlet-modal-body">
              {/* Search Bar */}
              <div className="outlet-search">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-btn" onClick={handleClearSearch}>
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Filters */}
              <div className="quick-filters">
                {quickFilters.map((filter, index) => (
                  <button
                    key={index}
                    className="quick-filter"
                    onClick={() => setSearchTerm(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* All Outlets Section */}
              <div className="outlet-list">
                <div className="outlet-item">
                  <i className="fas fa-store outlet-icon"></i>
                  <span>All Outlet</span>
                </div>

                {/* Outlet List */}
                {isLoading ? (
                  <div className="text-center py-3">Loading outlets...</div>
                ) : error ? (
                  <div className="text-center py-3 text-danger">{error}</div>
                ) : (
                  outlets
                    .filter((outlet) => {
                      const search = searchTerm.toLowerCase();
                      return (
                        outlet.name.toLowerCase().includes(search) ||
                        outlet.outlet_id.toString().includes(search) ||
                        (outlet.location &&
                          outlet.location.toLowerCase().includes(search))
                      );
                    })
                    .map((outlet) => (
                      <div
                        key={outlet.outlet_id}
                        className="outlet-item"
                        onClick={() => {
                          handleOutletSelect(outlet);
                          setShowOutletModal(false);
                        }}
                      >
                        <i
                          className={`fas ${
                            outlet.outlet_status ? "fa-store" : "fa-store-slash"
                          } outlet-icon`}
                        ></i>
                        <div className="outlet-info">
                          <span className="outlet-name">{outlet.name}</span>
                          {outlet.location && (
                            <span className="outlet-location">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {outlet.location}
                            </span>
                          )}
                        </div>
                        <div className="outlet-meta">
                          <span className="outlet-id">
                            [ID: {outlet.outlet_id}]
                          </span>
                          <span
                            className={`outlet-status ${
                              outlet.status === "open"
                                ? "status-open"
                                : "status-closed"
                            }`}
                          >
                            {outlet.status === "open" ? "Open" : "Closed"}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show banner only when selected outlet status is false */}
      {selectedOutletData?.outlet_status === false && (
        <div className="inactive-outlet-banner">
          This outlet is inactive. Please contact support.
        </div>
      )}
    </div>
  );
}

export default Header