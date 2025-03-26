import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/img/avatars/1.png'
import 'animate.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDashboard } from '../context/DashboardContext'

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
      
      // Get user_id and access token from localStorage
      const userId = localStorage.getItem('user_id');
      const accessToken = localStorage.getItem('access');
      
      if (!userId || !accessToken) {
        setError('Authentication failed. Please login again.');
        return;
      }

      const response = await fetch('https://men4u.xyz/common_api/get_outlet_list', {
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
        // Transform API data to match our UI structure
        const transformedOutlets = data.outlet_list.map(outlet => ({
          name: outlet.name,
          location: outlet.address,
          status: outlet.is_open ? 'open' : 'closed',
          outlet_id: outlet.outlet_id,
          is_active: outlet.is_active
        }));
        
        // Filter out inactive outlets or handle them differently
        const activeOutlets = transformedOutlets.filter(outlet => outlet.is_active !== false);
        setOutlets(activeOutlets);
        
        // If there's a stored outlet_id, update UI
        const storedOutletId = localStorage.getItem('outlet_id');
        if (storedOutletId) {
          const matchingOutlet = activeOutlets.find(o => o.outlet_id.toString() === storedOutletId);
          if (matchingOutlet) {
            // Just update the UI without calling handleOutletSelect
            const truncatedName = truncateText(matchingOutlet.name, 20);
            setSelectedOutlet(truncatedName);
            setOutletId(matchingOutlet.outlet_id.toString());
          }
        }
      } else if (data.st === 2) {
        // Handle inactive outlet specifically
        console.log('Outlet inactive status received:', data.msg);
        setOutlets([]); // Clear outlets to show "No outlets found"
        // Optional: Show a more specific message
        setError(data.msg || 'No active outlets available');
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
      // Check if already selected
      const currentOutletId = localStorage.getItem('outlet_id');
      if (currentOutletId && currentOutletId === outlet.outlet_id.toString()) {
        // Already selected, just update UI and return
        const truncatedName = truncateText(outlet.name, 20);
        setSelectedOutlet(truncatedName);
        setOutletId(outlet.outlet_id.toString());
        return;
      }
      
      setIsLoading(true);
      
      // Get user_id from localStorage
      const userId = localStorage.getItem('user_id');
      const accessToken = localStorage.getItem('access');
      
      if (!userId || !accessToken) {
        showToast('Authentication failed. Please login again.', 'error');
        return;
      }
      
      // Make API call to select outlet
      const response = await fetch('https://men4u.xyz/common_api/select_outlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          outlet_id: outlet.outlet_id,
          owner_id: parseInt(userId)
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showToast('Session expired. Please login again.', 'error');
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.st === 1) {
        // Success - update UI with selected outlet
        const truncatedName = truncateText(outlet.name, 20);
        setSelectedOutlet(truncatedName);
        setOutletId(outlet.outlet_id.toString());
        
        // Store outlet_id in localStorage
        localStorage.setItem('outlet_id', outlet.outlet_id.toString());
        
        // Show success toast
        showToast(`Outlet "${outlet.name}" selected successfully!`, 'success');
        
        // Add a small delay to ensure toast is visible
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
      } else if (data.st === 2) {
        // Handle inactive outlet with toast
        showToast(data.msg || 'This outlet is inactive', 'warning');
      } else {
        // Handle general error with toast
        showToast(data.msg || 'Failed to select outlet', 'error');
      }
    } catch (err) {
      console.error('Error selecting outlet:', err);
      showToast("This outlet is inactive. Please contact support.", "error");
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
    fetchOutlets(); // Refresh outlets data
    
    // Refresh dashboard data from context
    refreshDashboard();
    
    // Reset rotation after animation completes
    setTimeout(() => {
      setIsRotating(false);
    }, 1000); // Match this with the CSS animation duration
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
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 1000,
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
          marginBottom: '1.5rem'
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
            padding: '0 1.5rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
            <a
              className="nav-item nav-link px-0 me-xl-6"
              href="javascript:void(0)"
              onClick={toggleMenu}
              style={{ padding: '0.75rem' }}
            >
              <i className={`fas fa-${isMenuCollapsed ? "bars" : "times"}`} />
            </a>
          </div>
          <div
            className="navbar-nav-right d-flex align-items-center"
            id="navbar-collapse"
            style={{ padding: '0.5rem 0' }}
          >
            {/* Outlet Selector Dropdown */}
            <div className="navbar-nav flex-row">
              <li className="nav-item dropdown me-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                  style={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px'
                  }}
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
                  {isLoading ? (
                    <li className="px-3 py-2 text-center">
                      <small>Loading outlets...</small>
                    </li>
                  ) : error ? (
                    <li className="px-3 py-2 text-center text-danger">
                      <small>{error}</small>
                    </li>
                  ) : outlets.length === 0 ? (
                    <li className="px-3 py-2 text-center">
                      <small>No outlets found</small>
                    </li>
                  ) : (
                    outlets
                      .filter(outlet => 
                        outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        outlet.location.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((outlet) => (
                        <li key={outlet.outlet_id}>
                          <a
                            className="dropdown-item d-flex align-items-center justify-content-between"
                            href="javascript:void(0);"
                            onClick={() => handleOutletSelect(outlet)}
                          >
                            <div className="d-flex align-items-center me-4">
                              <i className="fas fa-store me-2"></i>
                              <b>{outlet.name}</b>
                            </div>
                            
                            <div className="ms-auto d-flex align-items-center">
                              <span className="mx-1 badge bg-label-primary rounded-pill">
                                {outlet.location}
                              </span>
                              {outlet.status === "open" ? (
                                <span className="mx-1 badge bg-label-success rounded-pill">
                                  Open
                                </span>
                              ) : (
                                <span className="mx-1 badge bg-label-danger rounded-pill">
                                  Closed
                                </span>
                              )}
                            </div>
                          </a>
                        </li>
                      ))
                  )}
                </ul>
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
                    style={{ padding: '4px' }}
                  >
                    <i className={`fas fa-sync-alt ${isRotating ? 'rotate-animation' : ''}`}></i>
                  </button>
                  <small className="text-black">
                    Updated {timeElapsed}
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
                    <Link
                      className="dropdown-item"
                      to="/profile"
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
                    <Link
                      className="dropdown-item"
                      to="/dashboard"
                    >
                      <i className="fas fa-tasks fa-lg me-2" />
                      <span className="align-middle">My activity</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/settings"
                    >
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
    </div>
  );
}

export default Header