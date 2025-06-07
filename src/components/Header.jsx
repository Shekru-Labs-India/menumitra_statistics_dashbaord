import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'animate.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDashboard } from '../context/DashboardContext'
import { apiEndpoint } from '../config/menuMitraConfig'

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState(() => {
    // Initialize with stored outlet name if available
    const storedOutletId = localStorage.getItem('outlet_id');
    return storedOutletId ? 'Loading...' : '';
  });
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

      const deviceToken = localStorage.getItem('device_token');
      const userRole = localStorage.getItem('role');

      if (!deviceToken) {
        setError('Device token not found. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://menusmitra.xyz/1.3/common_api/get_outlet_list_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          device_token: deviceToken,
          role: userRole
        })
      });

      const data = await response.json();
      
      if (data.st === 5) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      if (data.st === 1) {
        setOutlets(data.outlet_list);
        
        // If there's a stored outlet_id, update selected outlet data
        if (storedOutletId) {
          const matchingOutlet = data.outlet_list.find(o => o.outlet_id.toString() === storedOutletId);
          if (matchingOutlet) {
            const truncatedName = truncateText(matchingOutlet.name, 20);
            setSelectedOutlet(truncatedName);
            setOutletId(matchingOutlet.outlet_id.toString());
            setSelectedOutletData(matchingOutlet);
          }
        } else if (data.outlet_list.length > 0) {
          // If no stored outlet_id, select the first outlet automatically
          const firstOutlet = data.outlet_list[0];
          const truncatedName = truncateText(firstOutlet.name, 20);
          setSelectedOutlet(truncatedName);
          setOutletId(firstOutlet.outlet_id.toString());
          setSelectedOutletData(firstOutlet);
          localStorage.setItem('outlet_id', firstOutlet.outlet_id.toString());
          
          // Trigger dashboard refresh with the selected outlet
          refreshDashboard();
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
    // Dispatch a custom event for filter reset
    const resetEvent = new CustomEvent('resetFiltersToAllTime');
    window.dispatchEvent(resetEvent);
    // Call refresh dashboard after dispatching event
    refreshDashboard();
    setTimeout(() => {
      setIsRotating(false);
    }, 1000); // Stop rotation after 1s
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    // Add click event listener to close menu when clicking outside
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('layout-overlay')) {
        document.documentElement.classList.remove('layout-menu-expanded');
        const menu = document.querySelector('.layout-menu');
        if (menu) {
          menu.classList.remove('expanded');
        }
      }
    };

    document.addEventListener('click', handleOverlayClick);

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, []);

  // Add click outside listener for outlet modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalContent = document.querySelector('.outlet-modal-content');
      const modalTrigger = document.querySelector('.outlet-select-btn');
      
      if (showOutletModal && modalContent && !modalContent.contains(event.target) && !modalTrigger?.contains(event.target)) {
        setShowOutletModal(false);
      }
    };

    if (showOutletModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOutletModal]);

  // Add styles for outlet modal
  const modalStyles = `
    .outlet-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 2rem;
      z-index: 1050;
    }

    .outlet-modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 85vh;
      overflow: hidden;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
      position: relative;
    }
  `;

  return (
    <div>
      <style>{modalStyles}</style>
     
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

          /* Mobile styles for outlet selector */
          @media (max-width: 768px) {
            .outlet-select-btn {
              padding: 4px 10px !important;
              font-size: 0.875rem !important;
            }
            .outlet-select-btn i {
              font-size: 0.875rem !important;
            }
            .outlet-select-btn span {
              max-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: inline-block;
            }
          }

          /* Outlet Modal Styles */
          .outlet-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 2rem;
            z-index: 1050;
          }

          .outlet-modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow: hidden;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
          }

          .outlet-modal-header {
            padding: 0.75rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .outlet-modal-body {
            padding: 0.75rem 1.5rem;
            overflow-y: auto;
            max-height: calc(85vh - 70px);
          }

          /* Outlet Search Styles */
          .outlet-search {
            position: relative;
            margin-bottom: 0.10rem;
          }

          .outlet-search input {
            width: 100%;
            padding: 0.5rem 2.5rem;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            font-size: 0.9rem;
          }

          .outlet-search i {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
          }

          .outlet-search .clear-btn {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: none;
            color: #666;
            cursor: pointer;
            padding: 0;
          }

          /* Outlet List Styles */
          .outlet-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .outlet-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .outlet-item:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
          }

          .outlet-info {
            flex: 1;
            min-width: 0;
          }

          .outlet-name-container {
            font-weight: 500;
            color: #333;
          }

          .outlet-name-container i {
            font-size: 1rem;
            color: #666;
            width: 20px;
            text-align: center;
          }

          .outlet-location {
            font-size: 0.8rem;
            color: #6c757d;
          }

          .outlet-location i {
            font-size: 0.875rem;
            color: #6c757d;
            width: 20px;
            text-align: center;
          }

          .outlet-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-left: 1rem;
          }

          .account-type-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .outlet-status {
            padding: 0.15rem 0.3rem;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .status-open {
            background-color: #e8f5e9;
            color:rgb(35, 152, 41);
          }

          .status-closed {
            background-color: #ffebee;
            color: #c62828;
          }

          /* Quick Filters */
          .quick-filters {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;
          }

          .quick-filter {
            padding: 0.25rem 0.75rem;
            border: 1px solid #e9ecef;
            border-radius: 20px;
            font-size: 0.8rem;
            background: none;
            cursor: pointer;
            transition: all 0.2s;
          }

          .quick-filter:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .outlet-modal-content {
              width: 95%;
              margin: 0.5rem;
            }

            .outlet-modal-body {
              padding: 1rem;
            }

            .outlet-item {
              padding: 0.5rem;
            }

            .outlet-meta {
              flex-direction: column;
              gap: 0.25rem;
              margin-left: 0.5rem;
            }
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

          .last-updated-bar {
            padding: 4px 1.5rem;
            font-size: 0.75rem;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
          }

          .last-updated-bar button {
            padding: 2px 4px;
            background: transparent;
            border: 1px solid var(--bs-primary);
            border-radius: 20%;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
          }

          .last-updated-bar button i {
            display: inline-block;
          }

          .last-updated-bar button i.rotate-animation {
            animation: rotate 1s linear;
          }

          .last-updated-bar button:hover {
            color: var(--bs-primary);
          }

          @media (max-width: 768px) {
            .last-updated-bar {
              padding: 2px 1rem;
              font-size: 0.7rem;
            }
          }
        `}
      </style>

      {/* Add overlay div */}
      <div className="layout-overlay"></div>

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
            selectedOutletData?.outlet_status === false ? "0" : "0",
        }}
      >
        <div
          className="container-xxl"
          style={{
            padding: "0 1.5rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {/* Add Mobile Menu Button */}
          <button 
            className="d-xl-none btn btn-icon btn-ghost-secondary"
            onClick={() => {
              document.documentElement.classList.toggle('layout-menu-expanded');
              const menu = document.querySelector('.layout-menu');
              if (menu) {
                menu.classList.toggle('expanded');
              }
            }}
            style={{
              padding: '0.5rem',
              border: 'none',
              marginLeft: '-1.5rem'
            }}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div
            className="navbar-nav-right d-flex align-items-center"
            id="navbar-collapse"
            style={{ padding: "0.5rem 0" }}
          >
            {/* Outlet Selector Dropdown */}
            <div className="navbar-nav flex-row">
              <li className="nav-item dropdown me-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center outlet-select-btn"
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 600,
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px",
                    minWidth: "150px", // Add minimum width
                    justifyContent: "space-between" // Ensure icon stays at the end
                  }}
                  type="button"
                  onClick={() => setShowOutletModal(true)}
                  disabled={isLoading} // Disable button while loading
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-store me-2"></i>
                    <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isLoading ? "" : selectedOutlet || "Select Outlet"}
                    </span>
                  </div>
                </button>
              </li>
            </div>

            {/* Right aligned items */}
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Updated Time - Visible only on desktop */}
              <li className="nav-item me-3 mb-4 d-none d-md-block">
                <div className="d-flex flex-column align-items-start">
                  <button
                    className="btn btn-icon btn-sm btn-outline-primary mb-0"
                    onClick={handleRefresh}
                    style={{ padding: "2px", borderRadius: "20%", border: "1px solid var(--bs-primary)" }}
                  >
                    <i
                      className={`fas fa-sync-alt ${
                        isRotating ? "rotate-animation" : ""
                      }`}
                      style={{ color: "#6c757d" }}
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
                    <i className="far fa-user-circle fa-2x text-gray"></i>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end mt-3">
                  <li>
                    <div className="dropdown-item px-3 py-2">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-2">
                          <div className="avatar">
                            <i className="far fa-user-circle fa-2x text-gray"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 small">{userName}</h6>
                          <small className="text-muted">
                            {storedRole.toUpperCase()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <div className="px-3 pb-2">
                      <button
                        className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center"
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

      {/* Last Updated bar - Visible only on mobile */}
      <div className="last-updated-bar d-md-none">
        <button
          onClick={handleRefresh}
        >
          <i 
            className={`fas fa-sync-alt ${isRotating ? "rotate-animation" : ""}`} 
            style={{ color: "#6c757d" }}
          ></i>
        </button>
        <span>Last updated {timeElapsed}</span>
      </div>

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

              {/* Outlet List */}
              <div className="outlet-list">
                <div className="outlet-item">
                  <div className="outlet-info">
                    <div className="outlet-name-container d-flex align-items-center mb-1">
                      <i className="fas fa-store me-2"></i>
                      <span>All Outlets</span>
                    </div>
                  </div>
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
                          outlet.location.toLowerCase().includes(search)) ||
                        (outlet.address &&
                          outlet.address.toLowerCase().includes(search))
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
                        <div className="outlet-info">
                          <div className="outlet-name-container d-flex align-items-center mb-1">
                            <i className={`fas ${outlet.outlet_status ? "fa-store" : "fa-store-slash"} me-2`}></i>
                            <span className="outlet-name">{outlet.name}</span>
                          </div>
                          {(outlet.address || outlet.location) && (
                            <div className="outlet-location d-flex align-items-center">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              <span>{outlet.address || outlet.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="outlet-meta">
                          {outlet.Owner_id__account_type && (
                            <span className={`account-type-badge ${outlet.Owner_id__account_type === 'live' ? 'live' : 'test'}`} style={{ marginLeft: 0, marginRight: 0, fontWeight: 500, color: outlet.Owner_id__account_type === 'live' ? '#8b57ff' : '#ff9f43' }}>
                              {outlet.Owner_id__account_type === 'live' ? 'Live' : 'Test'}
                            </span>
                          )}
                          <span
                            className={`outlet-status ${
                              outlet.is_open
                                ? "status-open"
                                : "status-closed"
                            }`}
                          >
                            {outlet.is_open ? "Open" : "Closed"}
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