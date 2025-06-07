import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import { useDashboard } from '../context/DashboardContext'; // Import context

const OrderAnalytics = () => {
  // Get data from context
  const { 
    orderAnalytics_from_context,
    loading: contextLoading,
    error: contextError
  } = useDashboard();

  const [dateRange, setDateRange] = useState('All Time');
  const [loading, setLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false); // New state for reload action
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    avg_first_order_time: 0,
    avg_last_order_time: 0,
    avg_order_time: 0,
    avg_cooking_time: 0
  });
  const [userInteracted, setUserInteracted] = useState(false); // Flag to track user interaction

  // Helper function to get auth headers
  const getAuthHeaders = (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Only add Authorization header if includeAuth is true and token exists
    if (includeAuth) {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    
    return headers;
  };

  // Function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        console.error('Unauthorized access');
        // You may want to redirect to login page here
      }
      
      return error.response.data?.message || 'An error occurred. Please try again.';
    } else if (error.request) {
      return 'No response from server. Please check your internet connection.';
    } else {
      return 'Error setting up request. Please try again.';
    }
  };

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

  // Use context data when component mounts
  useEffect(() => {
    if (orderAnalytics_from_context) {
      setAnalyticsData({
        avg_first_order_time: orderAnalytics_from_context.first_order_time || '0 mins',
        avg_last_order_time: orderAnalytics_from_context.last_order_time || '0 mins',
        avg_order_time: orderAnalytics_from_context.average_order_time || '0 mins',
        avg_cooking_time: orderAnalytics_from_context.average_cooking_time || '0 mins'
      });
    }
  }, [orderAnalytics_from_context]);

  // Set error from context if available
  useEffect(() => {
    if (contextError && !userInteracted) {
      setError(contextError);
    }
  }, [contextError, userInteracted]);

  // Add event listener for header reload
  useEffect(() => {
    const handleHeaderReload = () => {
      setDateRange('All Time');
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(false);
      setUserInteracted(false);
      fetchData('All Time');
    };

    window.addEventListener('resetFiltersToAllTime', handleHeaderReload);
    return () => window.removeEventListener('resetFiltersToAllTime', handleHeaderReload);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDateRangeChange = (range) => {
    console.log('Date range changed to:', range);
    setDateRange(range);
    
    if (range === 'Custom Range') {
      // Only show date picker, don't reset dates
      setShowDatePicker(true);
    } else {
      // For non-custom ranges, reset dates and fetch data
      setShowDatePicker(false);
      setStartDate(null);
      setEndDate(null);
      fetchData(range);
    }
  };

  const handleReload = () => {
    console.log('Reloading data...');
    setUserInteracted(true);
    
    // Check if we have valid startDate and endDate (indicating custom range)
    if (startDate && endDate) {
      console.log('Reloading with custom date range:', formatDate(startDate), 'to', formatDate(endDate));
      // For custom range, explicitly use 'Custom Range'
      fetchData('Custom Range', true);
    } else {
      // For other ranges, use the current dateRange state
      console.log('Reloading with standard date range:', dateRange);
      fetchData(dateRange, true);
    }
  };

  const fetchData = async (range, isReloadAction = false) => {
    try {
      // Use isReloading for reload actions, main loading state otherwise
      if (isReloadAction) {
        setIsReloading(true);
      } else {
        setLoading(true);
      }
      setError('');
      setUserInteracted(true);
      
      const requestData = {
        outlet_id: localStorage.getItem('outlet_id'),
        device_token: localStorage.getItem('device_token'),
        device_id: localStorage.getItem('device_id'),
        start_date: '',
        end_date: ''
      };

      // Add date range if not "All Time"
      if (range === 'Custom Range' && startDate && endDate) {
        requestData.start_date = formatDate(startDate);
        requestData.end_date = formatDate(endDate);
      } else if (range !== 'All Time') {
        const dateRange = getDateRange(range);
        if (dateRange) {
          requestData.start_date = dateRange.start_date;
          requestData.end_date = dateRange.end_date;
        }
      }

      console.log('Making API request with data:', requestData);

      const response = await axios.post(
        `${apiEndpoint}order_analytics`,
        requestData,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setAnalyticsData({
          avg_first_order_time: data.first_order_time || '0 mins',
          avg_last_order_time: data.last_order_time || '0 mins',
          avg_order_time: data.average_order_time || '0 mins',
          avg_cooking_time: data.average_cooking_time || '0 mins'
        });
      } else {
        setError('No data available for the selected period');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(handleApiError(error));
    } finally {
      if (isReloadAction) {
        setIsReloading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Helper function to get date range
  const getDateRange = (range) => {
    const today = new Date();
    let start, end;
    
    switch (range) {
      case 'Today':
        start = end = new Date();
        break;
      case 'Yesterday':
        start = end = new Date();
        start.setDate(start.getDate() - 1);
        break;
      case 'Last 7 Days':
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - 6);
        break;
      case 'Last 30 Days':
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - 29);
        break;
      case 'Current Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'Last Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return null;
    }
    
    return {
      start_date: formatDate(start),
      end_date: formatDate(end)
    };
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchData('Custom Range');
    }
  };

  // Determine current loading state
  const isLoading = userInteracted ? loading : contextLoading;
  // Determine current error state
  const currentError = userInteracted ? error : contextError;

  return (
    <div className="col-12 col-md-6 col-lg-6">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
          <h5 className="card-title mb-0">Order Analytics</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
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
                ].map((range) => (
                  <li key={range}>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => handleDateRangeChange(range)}
                    >
                      {range}
                    </a>
                  </li>
                ))}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleDateRangeChange("Custom Range")}
                  >
                    Custom Range
                  </a>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className={`btn btn-icon p-0 ${isReloading ? "disabled" : ""}`}
              onClick={handleReload}
              disabled={isReloading}
              style={{ border: "1px solid var(--bs-primary)" }}
            >
              <i className={`fas fa-sync-alt ${isReloading ? "fa-spin" : ""}`}></i>
            </button>

             
          </div>
        </div>

        {showDatePicker && (
          <div className="card-body">
            <div className="d-flex flex-column gap-2">
              <label>Select Date Range:</label>
              <div className="d-flex flex-column flex-md-row gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  placeholderText="DD MMM YYYY"
                  className="form-control"
                  dateFormat="dd MMM yyyy"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  placeholderText="DD MMM YYYY"
                  className="form-control"
                  dateFormat="dd MMM yyyy"
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

        {currentError && (
          <div className="card-body">
            <div className="alert alert-danger" role="alert">
              {currentError}
            </div>
          </div>
        )}

        <div className="card-body">
          {isLoading ? (
            // Loading skeleton for analytics cards
            <div className="row g-4">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="col-md-6">
                  <div className="d-flex align-items-center mb-4 position-relative" style={{ minHeight: '80px' }}>
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px', opacity: 0.5 }}>
                    </div>
                    <div className="ms-4 d-flex flex-column">
                      <div className="bg-secondary mb-2" style={{ width: '120px', height: '18px', opacity: 0.5 }}></div>
                      <div className="bg-secondary" style={{ width: '80px', height: '16px', opacity: 0.5 }}></div>
                    </div>
                    <div className="position-absolute start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="position-relative w-100">
              {isReloading && (
                <div 
                  className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                  style={{ 
                    top: 0, 
                    left: 0, 
                    background: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1 
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Reloading...</span>
                  </div>
                </div>
              )}
              <div className={`row g-4 ${isReloading ? 'opacity-50' : ''}`}>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-4 pt-1">
                    <div
                      className="icon-bg bg-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="fas fa-clock text-white"></i>
                    </div>
                    <div className="ms-4 d-flex flex-column">
                      <h5 className="mb-0">Avg First Order Time</h5>
                      <p className="mb-0">{analyticsData.avg_first_order_time}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="icon-bg bg-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="fas fa-hourglass-half text-white"></i>
                    </div>
                    <div className="ms-4 d-flex flex-column">
                      <h5 className="mb-0">Avg Last Order Time</h5>
                      <p className="mb-0">{analyticsData.avg_last_order_time}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-4 mb-md-0">
                    <div
                      className="icon-bg bg-warning rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="fas fa-tachometer-alt text-white"></i>
                    </div>
                    <div className="ms-4 d-flex flex-column">
                      <h5 className="mb-0">Avg Order Time</h5>
                      <p className="mb-0">{analyticsData.avg_order_time}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div
                      className="icon-bg bg-danger rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="fas fa-utensils text-white"></i>
                    </div>
                    <div className="ms-4 d-flex flex-column">
                      <h5 className="mb-0">Avg Cooking Time</h5>
                      <p className="mb-0">{analyticsData.avg_cooking_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics; 