import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import PaymentMethodsChart from "../components/PaymentMethodsChart";
import RevenueLossWidget from "../components/RevenueLossWidget";
import ProductAnalysis from "../components/ProductAnalysis";
import OrderStat from "../components/OrderStat";
import FoodTypeGraph from "../components/FoodTypeGraph";
import OrderType from "../components/OrderType";
import OrderAnalytics from '../components/OrderAnalytics';
import Footer from "../components/Footer";
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import { apiEndpoint } from '../config/menuMitraConfig';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import PaymentMethodCount from "../components/PaymentMethodCount";
import WeeklyOrderStat from "../components/WeeklyOrderStat";
import { useDashboard } from "../context/DashboardContext"; // Import the context
import { UpdateService } from '../config/UpdateService'; // Import UpdateService
import logo from "../assets/img/company/MenuMitra_logo.png"; // Import logo
import TopCombos from "../components/TopCombos";

function HomeScreen() {
  // Get data from context
  const { 
    analyticReports_from_context,
    loading: contextLoading, 
    error: contextError,
    refreshDashboard
  } = useDashboard();

  const [dateRange, setDateRange] = useState('All Time');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [error, setError] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [statistics, setStatistics] = useState({
    total_orders: 0,
    average_order_value: 0,
    customer_count: 0,
    total_revenue: 0,
    average_turnover_time: "00:00 - 00:00"
  });
  const [userInteracted, setUserInteracted] = useState(false); // Flag to track if user has interacted with filters
  const didInitialLoadRef = useRef(false); // Use ref instead of state to avoid re-renders
  const postLoginFetchedRef = useRef(false); // Track if we've already fetched after login
  const navigate = useNavigate();
  
  // Add state for version check
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [versionInfo, setVersionInfo] = useState(null);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [redirectTimer, setRedirectTimer] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

  // Add new state for raw data
  const [rawData, setRawData] = useState(null);

  // Check if user just arrived from login/OTP verification
  const isPostLogin = () => {
    // Get the timestamp of when token was saved (if available)
    const tokenTimestamp = localStorage.getItem('token_timestamp');
    if (!tokenTimestamp) return false;
    
    // Check if token was saved recently (within last 10 seconds)
    const now = Date.now();
    const tokenTime = parseInt(tokenTimestamp, 10);
    return now - tokenTime < 10000; // 10 seconds
  };

  // Check version on component mount
  useEffect(() => {
    const checkVersion = async () => {
      const versionData = await UpdateService.checkForUpdates();
      setVersionInfo(versionData);
      
      if (versionData.hasUpdate) {
        setShowUpdatePopup(true);
        
        // Start progress bar for 5 seconds
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2; // 2% per 100ms = 100% in 5 seconds
          setRedirectProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            // Redirect to login after 5 seconds
            navigate('/login');
          }
        }, 100);
        
        setRedirectTimer(interval);
      }
    };
    
    checkVersion();
    
    // Cleanup interval on unmount
    return () => {
      if (redirectTimer) {
        clearInterval(redirectTimer);
      }
    };
  }, [navigate]);

  // Check if user is logged in
  useEffect(() => {
    // Don't check credentials on the login page to prevent redirect loops
    if (window.location.pathname.includes('/login')) {
      console.log('On login page, skipping auth check');
      return;
    }
    
    const outletId = localStorage.getItem('outlet_id');
    const accessToken = localStorage.getItem('access');
    
    // Log auth status for debugging
    console.log('HomeScreen auth check:', { 
      hasOutletId: !!outletId, 
      hasToken: !!accessToken,
      tokenLength: accessToken ? accessToken.length : 0,
      path: window.location.pathname,
      isPostLogin: isPostLogin(),
      didInitialLoadRef: didInitialLoadRef.current,
      postLoginFetchedRef: postLoginFetchedRef.current
    });
    
    if (!outletId || !accessToken) {
      console.warn('Missing credentials in HomeScreen, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Only fetch on initial mount or post-login (one time)
    if (!didInitialLoadRef.current) {
      console.log('First time load, marking initial load done');
      didInitialLoadRef.current = true;
      refreshDashboard();
      return;
    }
    
    // Handle the post-login case, but only once
    const isAfterLogin = isPostLogin();
    if (isAfterLogin && !postLoginFetchedRef.current) {
      console.log('Post-login detected, doing one-time refresh');
      postLoginFetchedRef.current = true;
      refreshDashboard();
    }
  }, [navigate, refreshDashboard]);

  // Use context data when component mounts
  useEffect(() => {
    if (analyticReports_from_context) {
      console.log('Received context data:', { 
        hasData: !!analyticReports_from_context,
        totalOrders: analyticReports_from_context.total_orders,
        timestamp: new Date().toISOString()
      });
      
      setStatistics({
        total_orders: analyticReports_from_context.total_orders || 0,
        average_order_value: analyticReports_from_context.avg_order_value || 0,
        customer_count: 0,
        total_revenue: analyticReports_from_context.total_revenue || 0,
        average_turnover_time: analyticReports_from_context.average_turnover_time || "0 min"
      });
    }
  }, [analyticReports_from_context]);

  // Set error from context if available and redirect to login if authentication fails
  useEffect(() => {
    // Don't process errors if already on login page
    if (window.location.pathname.includes('/login')) {
      return;
    }
    
    if (contextError && !userInteracted) {
      setError(contextError);
      
      // If error contains authentication-related terms, redirect to login
      if (
        contextError.includes('authentication') || 
        contextError.includes('credentials') || 
        contextError.includes('login') ||
        contextError.includes('expired')
      ) {
        console.warn('Authentication error from context, redirecting to login');
        navigate('/login');
      }
    }
  }, [contextError, userInteracted, navigate]);

  // Simplified effect to handle the animation timing
  useEffect(() => {
    if (isGifPlaying) {
      // Set a timeout to stop playing after 3 seconds
      const timer = setTimeout(() => {
        setIsGifPlaying(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isGifPlaying]);

  // Helper function to get auth headers
  const getAuthHeaders = useMemo(() => (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (includeAuth) {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    
    return headers;
  }, []);

  // Memoized date formatting function
  const formatDate = useMemo(() => (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}`;
  }, []);

  // Helper function to format currency in Indian format
  const formatIndianCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) return '₹0.00';
    
    const [integerPart, decimalPart = '00'] = num.toFixed(2).split('.');
    if (integerPart.length <= 3) {
      return `₹${integerPart}.${decimalPart}`;
    }
    
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `₹${formatted},${lastThree}.${decimalPart}`;
  };

  // Memoized function to prepare request data based on date range
  const prepareRequestData = useMemo(() => (range) => {
    const today = new Date();
    
    const getDateRange = (range) => {
      switch(range) {
        case 'All Time':
          return {}; // Only send outlet_id for All Time
        case 'Today':
          return {
            start_date: formatDate(today),
            end_date: formatDate(today)
          };
        case 'Yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          return {
            start_date: formatDate(yesterday),
            end_date: formatDate(yesterday)
          };
        }
        case 'Last 7 Days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          return {
            start_date: formatDate(sevenDaysAgo),
            end_date: formatDate(today)
          };
        }
        case 'Last 30 Days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 29);
          return {
            start_date: formatDate(thirtyDaysAgo),
            end_date: formatDate(today)
          };
        }
        case 'Current Month': {
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return {
            start_date: formatDate(firstDayOfMonth),
            end_date: formatDate(today)
          };
        }
        case 'Last Month': {
          const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          return {
            start_date: formatDate(firstDayOfLastMonth),
            end_date: formatDate(lastDayOfLastMonth)
          };
        }
        case 'Custom Range': {
          if (startDate && endDate) {
            return {
              start_date: formatDate(startDate),
              end_date: formatDate(endDate)
            };
          }
          return {};
        }
        default: {
          const defaultStart = new Date(today);
          defaultStart.setDate(today.getDate() - 29);
          return {
            start_date: formatDate(defaultStart),
            end_date: formatDate(today)
          };
        }
      }
    };

    const requestData = {
      ...getDateRange(range),
      outlet_id: localStorage.getItem('outlet_id'),
      device_token: localStorage.getItem('device_token') || '',
      device_id: localStorage.getItem('device_id') || ''
    };

    return requestData;
  }, [formatDate, startDate, endDate]);

  // Modified fetchStatistics to accept date range
  const fetchStatistics = async (isReloadAction = false) => {
    try {
      if (!isReloadAction) {
        setLoading(true);
      }
      setError('');
      setUserInteracted(true);

      const requestData = {
        outlet_id: localStorage.getItem('outlet_id'),
        device_token: localStorage.getItem('device_token') || '',
        device_id: localStorage.getItem('device_id') || '',
        // Add date range to request if available
        ...(startDate && endDate ? {
          start_date: formatDate(startDate),
          end_date: formatDate(endDate)
        } : {})
      };

      console.log('Fetching data with request:', requestData);

      const response = await axios.post(`${apiEndpoint}get_all_stats`, requestData, {
        headers: getAuthHeaders(true)
      });

      if (response.data?.message === 'success' && response.data?.data) {
        const responseData = response.data.data;
        setRawData(responseData); // Store raw data
        
        // Set statistics directly from response
        setStatistics({
          total_orders: responseData.total_orders || 0,
          average_order_value: responseData.average_order_value || 0,
          customer_count: 0,
          total_revenue: responseData.total_revenue || 0,
          average_turnover_time: responseData.average_turnover_time || "0 min"
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError('Failed to fetch statistics');
    } finally {
      if (!isReloadAction) {
        setLoading(false);
      }
      setIsReloading(false);
    }
  };

  // Modified date range change handler
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setUserInteracted(true); // Mark that user has interacted with filters
    
    if (range === 'Custom Range') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      // Calculate dates based on range
      let newStartDate = null;
      let newEndDate = null;
      const today = new Date();

      switch(range) {
        case 'Today':
          newStartDate = today;
          newEndDate = today;
          break;
        case 'Yesterday':
          newStartDate = new Date(today);
          newStartDate.setDate(today.getDate() - 1);
          newEndDate = newStartDate;
          break;
        case 'Last 7 Days':
          newStartDate = new Date(today);
          newStartDate.setDate(today.getDate() - 6);
          newEndDate = today;
          break;
        case 'Last 30 Days':
          newStartDate = new Date(today);
          newStartDate.setDate(today.getDate() - 29);
          newEndDate = today;
          break;
        case 'Current Month':
          newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
          newEndDate = today;
          break;
        case 'Last Month':
          newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
        case 'All Time':
        default:
          newStartDate = null;
          newEndDate = null;
          break;
      }

      setStartDate(newStartDate);
      setEndDate(newEndDate);
      
      // Immediately trigger data refresh
      if (newStartDate && newEndDate) {
        refreshDashboard({
          start_date: formatDate(newStartDate),
          end_date: formatDate(newEndDate)
        });
      } else {
        refreshDashboard();
      }
    }
  };
  const handleRefresh = async () => {
    try {
      setIsRotating(true);
      setIsReloading(true);

      // If we have a custom date range, use those dates
      if (startDate && endDate) {
        await refreshDashboard({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate)
        });
      } else {
        // For non-custom ranges, use the current dateRange
        let newStartDate = null;
        let newEndDate = null;
        const today = new Date();

        switch(dateRange) {
          case 'Today':
            newStartDate = today;
            newEndDate = today;
            break;
          case 'Yesterday':
            newStartDate = new Date(today);
            newStartDate.setDate(today.getDate() - 1);
            newEndDate = newStartDate;
            break;
          case 'Last 7 Days':
            newStartDate = new Date(today);
            newStartDate.setDate(today.getDate() - 6);
            newEndDate = today;
            break;
          case 'Last 30 Days':
            newStartDate = new Date(today);
            newStartDate.setDate(today.getDate() - 29);
            newEndDate = today;
            break;
          case 'Current Month':
            newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
            newEndDate = today;
            break;
          case 'Last Month':
            newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
          default:
            // For 'All Time' or any other case
            await refreshDashboard();
            break;
        }

        if (newStartDate && newEndDate) {
          await refreshDashboard({
            start_date: formatDate(newStartDate),
            end_date: formatDate(newEndDate)
          });
        }
      }
    } catch (err) {
      console.error('Error refreshing stats:', err);
    } finally {
      setTimeout(() => {
        setIsRotating(false);
        setIsReloading(false);
      }, 1000);
    }
  };

  // Modified custom date select handler
  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      setUserInteracted(true); // Mark that user has interacted with filters
      
      // Immediately trigger data refresh
      refreshDashboard({
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      });
    }
  };

  // Add useEffect to handle data updates when date range changes
  useEffect(() => {
    if (userInteracted && startDate && endDate) {
      refreshDashboard({
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      });
    }
  }, [startDate, endDate, userInteracted]);

  // Skeleton card component
  const StatCardSkeleton = ({ color }) => {
    // Define color mapping for different variants
    const colorMap = {
      primary: { base: '#cfe2ff', highlight: '#9ec5fe' },
      success: { base: '#d1e7dd', highlight: '#a3cfbb' },
      warning: { base: '#fff3cd', highlight: '#ffe69c' },
      info: { base: '#cff4fc', highlight: '#9eeaf9' },
      danger: { base: '#f8d7da', highlight: '#f1aeb5' }
    };

    const selectedColor = colorMap[color] || colorMap.primary;

    return (
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex align-items-start justify-content-between">
              <div className="content-left" style={{ flex: 1 }}>
                <Skeleton width={120} height={20} className="mb-2" />
                <div className="d-flex align-items-center">
                  <Skeleton width={80} height={28} className="me-2" />
                  <Skeleton width={40} height={20}  />
                </div>
              </div>
              <div className="avatar">
                <Skeleton 
                  width={38} 
                  height={38} 
                  baseColor={selectedColor.base}
                  highlightColor={selectedColor.highlight}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats card component
  const StatCard = ({ title, value, icon, color, isPrice }) => {
    // Define background colors for each type
    const bgColorMap = {
      primary: 'rgba(115, 103, 240, 0.12)',  // Purple background
      success: 'rgba(40, 199, 111, 0.12)',   // Green background
      info: 'rgba(0, 207, 232, 0.12)',       // Blue background
      danger: 'rgba(234, 84, 85, 0.12)',     // Red background
    };

    // Define icon colors
    const iconColorMap = {
      primary: '#7367f0',  // Purple
      success: '#28c76f',  // Green
      info: '#00cfe8',     // Blue
      danger: '#ea5455',   // Red
    };

    return (
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="card-info">
              <p className="card-text mb-2" style={{ color: '#545151', fontWeight: '500' }}>{title}</p>
              <div className="d-flex align-items-center mb-1">
                <h4 className="mb-0 me-2">
                  {isPrice ? '' : ''}{value}
                </h4>
              </div>
            </div>
            <div 
              className="avatar avatar-stats p-50"
              style={{
                backgroundColor: bgColorMap[color],
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20%'
              }}
            >
              <i 
                className={icon}
                style={{
                  color: iconColorMap[color],
                  fontSize: '1.2rem'
                }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Determine current loading state
  const isLoading = userInteracted ? loading : contextLoading;
  // Determine current error state
  const currentError = userInteracted ? error : contextError;

  // If update popup is shown, render the update popup
  if (showUpdatePopup) {
    return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <div className="layout-page d-flex flex-column min-vh-100">
            <div className="content-wrapper flex-grow-1">
              <div className="container-fluid flex-grow-1 container-p-y">
                <div className="row justify-content-center">
                  <div className="col-md-8 col-lg-6">
                    <div className="card">
                      <div className="card-body p-4">
                        <div className="text-center mb-4">
                          <img
                            src={logo}
                            alt="MenuMitra Logo"
                            style={{
                              width: "150px",
                              height: "auto",
                              marginBottom: "1.5rem"
                            }}
                          />
                          <h3 className="mb-3" style={{ color: '#dc3545' }}>
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Update Required
                          </h3>
                        </div>

                        <div className="mb-4 text-center">
                          <p className="mb-2 fs-5">Current Version: <strong>{versionInfo?.currentVersion || '1.0.0'}</strong></p>
                          <p className="mb-4 fs-5">Latest Version: <strong>{versionInfo?.serverVersion || '1.3'}</strong></p>
                        </div>

                        <p className="text-danger fs-5">
                          Please update your application to the latest version to continue.
                        </p>

                        <div className="mt-4">
                          <div className="progress mb-2" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                              role="progressbar" 
                              style={{ width: `${redirectProgress}%` }}
                              aria-valuenow={redirectProgress} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <p className="text-center text-muted">
                            Redirecting to login in {Math.ceil((100 - redirectProgress) / 2)} seconds...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add event listener for header reload
  useEffect(() => {
    const handleHeaderReload = (event) => {
      // Only reset filters, don't trigger rotation animation
      setDateRange('All Time');
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(false);
      setUserInteracted(false);
      
      // Check if the reload is from header
      if (event.detail?.source === 'header') {
        // Don't set isReloading to true for header reloads
        fetchStatistics('All Time', false);
      } else {
        // For personal reloads, set isReloading to true
        setIsReloading(true);
        fetchStatistics('All Time', true);
      }
    };

    window.addEventListener('resetFiltersToAllTime', handleHeaderReload);
    return () => window.removeEventListener('resetFiltersToAllTime', handleHeaderReload);
  }, []);

  // Add event listener for stats updates
  useEffect(() => {
    const handleStatsUpdate = (event) => {
      const responseData = event.detail;
      setRawData(responseData);
      
      // Update statistics with new data
      setStatistics({
        total_orders: responseData.analytic_reports?.total_orders || 0,
        average_order_value: responseData.analytic_reports?.avg_order_value || 0,
        customer_count: 0,
        total_revenue: responseData.analytic_reports?.total_revenue || 0,
        average_turnover_time: responseData.analytic_reports?.average_turnover_time || "0 min"
      });
    };

    window.addEventListener('statsDataUpdated', handleStatsUpdate);
    return () => window.removeEventListener('statsDataUpdated', handleStatsUpdate);
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          
          {/* Filter Section */}
          <div className="mb-4 px-4 pt-3">
            <div className="d-flex justify-content-end align-items-center">
              <button
                className="btn btn-icon btn-outline-primary me-2"
                onClick={handleRefresh}
                style={{ 
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--bs-primary)",
                  width: "42px",
                  height: "42px"
                }}
              >
                <i
                  className={`fas fa-sync-alt ${isReloading ? "rotate-animation" : ""}`}
                  style={{ color: "#6c757d" }}
                ></i>
              </button>
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-outline-primary dropdown-toggle px-3 py-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "1rem",
                    minWidth: "150px",
                    height: "42px"
                  }}
                >
                  <i className="fas fa-calendar me-2"></i>
                  {dateRange}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {[
                    "All Time",
                    "Today",
                    "Yesterday",
                    "Last 7 Days",
                    "Last 30 Days",
                    "Current Month",
                    "Last Month",
                    "Custom Range"
                  ].map((option) => (
                    <li key={option}>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item"
                        onClick={() => handleDateRangeChange(option)}
                      >
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {showDatePicker && (
              <div className="mt-3">
                <div className="d-flex flex-column gap-2">
                  <label>Select Date Range:</label>
                  <div className="d-flex gap-2">
                    <DatePicker
                      selected={startDate}
                      onChange={setStartDate}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={new Date()}
                      className="form-control"
                      dateFormat="dd MMM yyyy"
                      placeholderText="DD MMM YYYY"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={setEndDate}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      className="form-control"
                      dateFormat="dd MMM yyyy"
                      placeholderText="DD MMM YYYY"
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleCustomDateSelect}
                    disabled={!startDate || !endDate}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="content-wrapper flex-grow-1">
            <div className="container-fluid flex-grow-1 container-p-y">
              {currentError && (
                <div className="alert alert-danger mb-4" role="alert">
                  {currentError}
                </div>
              )}
              
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                {isLoading ? (
                  <>
                    <StatCardSkeleton color="primary" />
                    <StatCardSkeleton color="success" />
                    <StatCardSkeleton color="warning" />
                    <StatCardSkeleton color="info" />
                  </>
                ) : (
                  <>
                    <StatCard
                      title="Total Orders"
                      value={statistics.total_orders || 0}
                      icon="fas fa-shopping-cart"
                      color="primary"
                    />
                    <StatCard
                      title="Total Revenue"
                      value={formatIndianCurrency(statistics.total_revenue || 0)}
                      icon="fas fa-rupee-sign"
                      color="success"
                      isPrice
                    />
                    <StatCard
                      title="Average Order Value"
                      value={formatIndianCurrency(statistics.average_order_value || 0)}
                      icon="fas fa-chart-line"
                      color="info"
                      isPrice
                    />
                    <StatCard
                      title="Table Turnover"
                      value={statistics.average_turnover_time}
                      icon="fas fa-chair"
                      color="danger"
                    />
                  </>
                )}
              </div>

              {/* Charts Section */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <PaymentMethodsChart />
                  </div>
                </div>
                {/* <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <RevenueLossWidget />
                  </div>
                </div> */}
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <OrderStat />
                  </div>
                </div>
              </div>

              {/* Sales Section */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <ProductAnalysis />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <FoodTypeGraph />
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <OrderType />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <WeeklyOrderStat />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <TopCombos />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;