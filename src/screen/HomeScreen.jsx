import React, { useState, useEffect } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import PaymentMethodsChart from "../components/PaymentMethodsChart";
import RevenueLossWidget from "../components/RevenueLossWidget";
import TopSell from "../components/TopSell";
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

function HomeScreen() {
  const [dateRange, setDateRange] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    total_orders: 0,
    average_order_value: 0,
    customer_count: 0,
    total_revenue: 0,
    average_turnover_time: "00:00 - 00:00"
  });
  const navigate = useNavigate();
  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Add JWT token to requests
  useEffect(() => {
    // Create an interceptor for adding the auth token to requests
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem('access');
        
        // If token exists, add it to the Authorization header as a Bearer token
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject the interceptor when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const outletId = localStorage.getItem('outlet_id');
    if (!outletId) {
      navigate('/login');
    }
  }, []);

  // Add request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const outletId = localStorage.getItem('outlet_id');
      if (outletId) {
        if (config.method === 'get' && config.params) {
          config.params = { ...config.params, outlet_id: outletId };
        } else if (config.method === 'post' && config.data) {
          config.data = { ...config.data, outlet_id: outletId };
        } else {
          config.params = { outlet_id: outletId };
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark that we've tried to refresh token
        
        try {
          // Get the refresh token from localStorage
          const refreshToken = localStorage.getItem('refresh');
          
          if (!refreshToken) {
            // If no refresh token, redirect to login
            console.error('No refresh token available');
            navigate('/login');
            return Promise.reject(error);
          }
          
          // Call the refresh token endpoint to get a new access token
          // You would need to implement this endpoint on your backend
          const response = await axios.post(`${apiEndpoint}refresh_token`, {
            refresh: refreshToken
          });
          
          // If successful, update the tokens in localStorage
          if (response.data.access) {
            localStorage.setItem('access', response.data.access);
            
            // If a new refresh token is also provided, update it
            if (response.data.refresh) {
              localStorage.setItem('refresh', response.data.refresh);
            }
            
            // Update the Authorization header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
            
            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, redirect to login
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }
      
      // Handle other error responses
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.error('Unauthorized access');
            // Handle unauthorized access (e.g., redirect to login)
            navigate('/login');
            break;
          case 403:
            console.error('Forbidden access');
            break;
          case 404:
            console.error('Resource not found');
            break;
          default:
            console.error('Server error:', error.response.data);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      return Promise.reject(error);
    }
  );

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

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const outletId = localStorage.getItem('outlet_id');
    console.log('Outlet ID from localStorage:', outletId);
    
    if (outletId) {
      console.log('Fetching statistics for outlet ID:', outletId);
      // Set default dates for all-time data
      const today = new Date();
      const oldDate = new Date(2000, 0, 1); // January 1, 2000
      
      setStartDate(oldDate);
      setEndDate(today);
      setDateRange("All Time"); // Just for display purposes
      
      // Custom fetch for initial load with all time data
      fetchAllTimeStatistics(outletId);
    } else {
      console.error('No outlet ID found in localStorage');
      return;
    }
  }, []);

  // Function to fetch all-time statistics at initial load
  const fetchAllTimeStatistics = async (outletId) => {
    try {
      setLoading(true);
      setError('');
      
      // For All Time data, just send the outlet_id without any date parameters
      const requestData = {
        outlet_id: outletId
      };

      console.log('Sending initial request with data:', requestData);
      console.log('API endpoint:', apiEndpoint + 'analytics_reports');

      // Use POST method
      const response = await axiosInstance.post('analytics_reports', requestData);
      
      console.log('API Response:', response.data);
      
      if (response.data) {
        // Update statistics state with the received data
        setStatistics({
          total_orders: response.data.total_orders || 0,
          average_order_value: response.data.average_order_value || 0,
          customer_count: response.data.customer_count || 0,
          total_revenue: response.data.total_revenue || 0,
          average_turnover_time: response.data.average_turnover_time || "00:00 - 00:00"
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError(error.response?.data?.message || 'Failed to fetch statistics. Please try again.');
      // Reset statistics on error
      setStatistics({
        total_orders: 0,
        average_order_value: 0,
        customer_count: 0,
        total_revenue: 0,
        average_turnover_time: "00:00 - 00:00"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function for fetching statistics with date range filters
  const fetchStatistics = async (range) => {
    try {
      setLoading(true);
      setError('');
      
      let requestData = {};
      const today = new Date();
      
      // Handle different date range options with explicit date calculations
      if (range === 'All Time') {
        // For All Time, don't send start_date and end_date
        requestData = {};
      } else if (range === 'Today') {
        // Today - both start and end are today
        requestData = {
          start_date: today.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        };
      } else if (range === 'Yesterday') {
        // Yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        requestData = {
          start_date: yesterday.toISOString().split('T')[0],
          end_date: yesterday.toISOString().split('T')[0]
        };
      } else if (range === 'Last 7 Days') {
        // Last 7 Days
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6); // -6 because it includes today
        requestData = {
          start_date: sevenDaysAgo.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        };
      } else if (range === 'Last 30 Days') {
        // Last 30 Days
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29); // -29 because it includes today
        requestData = {
          start_date: thirtyDaysAgo.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        };
      } else if (range === 'Current Month') {
        // Current Month - from 1st of current month to today
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        requestData = {
          start_date: firstDayOfMonth.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        };
      } else if (range === 'Last Month') {
        // Last Month - from 1st to last day of previous month
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        requestData = {
          start_date: firstDayOfLastMonth.toISOString().split('T')[0],
          end_date: lastDayOfLastMonth.toISOString().split('T')[0]
        };
      } else if (range === 'Custom Range' && startDate && endDate) {
        // Custom Range - use the selected dates
        requestData = {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        };
      } else {
        // If Custom Range but no dates selected, default to last 30 days
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29);
        
        requestData = {
          start_date: thirtyDaysAgo.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        };
        // Update the displayed date range
        setDateRange('Last 30 Days');
      }
      
      // Add outlet_id explicitly to the request data
      const outletId = localStorage.getItem('outlet_id');
      requestData.outlet_id = outletId;

      console.log('Sending request with data:', requestData);
      console.log('API endpoint:', apiEndpoint + 'analytics_reports');

      // Use POST method
      const response = await axiosInstance.post('analytics_reports', requestData);
      
      console.log('API Response:', response.data);
      
      if (response.data) {
        // Update statistics state with the received data
        setStatistics({
          total_orders: response.data.total_orders || 0,
          average_order_value: response.data.average_order_value || 0,
          customer_count: response.data.customer_count || 0,
          total_revenue: response.data.total_revenue || 0,
          average_turnover_time: response.data.average_turnover_time || "00:00 - 00:00"
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError(error.response?.data?.message || 'Failed to fetch statistics. Please try again.');
      // Reset statistics on error
      setStatistics({
        total_orders: 0,
        average_order_value: 0,
        customer_count: 0,
        total_revenue: 0,
        average_turnover_time: "00:00 - 00:00"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    if (range === 'Custom Range') {
      // Reset date selections when opening custom date picker
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      fetchStatistics(range);
    }
  };

  const handleReload = () => {
    fetchStatistics(dateRange);
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchStatistics('Custom Range');
    } else {
      // Show error message if dates are not selected
      setError('Please select both start and end dates.');
    }
  };

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
  const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-6 col-lg-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between">
            <div className="content-left">
              <span className="fw-medium d-block mb-1">
                {title}
              </span>
              <div className="d-flex align-items-center">
                <h4 className="mb-0 me-2">{value}</h4>
                {/* <span className="text-success">({percentage})</span> */}
              </div>
            </div>
            <div className="avatar">
              <span className={`avatar-initial rounded bg-label-${color}`}>
                <i className={icon}></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          <div className="content-wrapper flex-grow-1">
            <div className="container-xxl flex-grow-1 container-p-y">
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              {/* Welcome Card Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-md-center align-items-start p-4">
                      <h5 className="card-title mb-0">
                        Welcome to MenuMitra Owner Dashboard
                      </h5>
                      <div className="d-flex align-items-center gap-3">
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
                                onClick={() =>
                                  handleDateRangeChange("Custom Range")
                                }
                              >
                                Custom Range
                              </a>
                            </li>
                          </ul>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-icon p-0 ${
                            loading ? "disabled" : ""
                          }`}
                          onClick={handleReload}
                          disabled={loading}
                          style={{ border: '1px solid var(--bs-primary)' }}
                        >
                          <i
                            className={`fas fa-sync-alt ${
                              loading ? "fa-spin" : ""
                            }`}
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm p-0"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            position: "relative",
                            border: '1px solid #e9ecef'
                          }}
                          onClick={() => setIsGifPlaying(true)}
                          title={
                            isGifPlaying
                              ? "Animation playing"
                              : "Click to play animation"
                          }
                        >
                          {/* Using two separate images - static frame and animated */}
                          {isGifPlaying ? (
                            // Show animated GIF when playing
                            <img
                              src={aiAnimationGif}
                              alt="AI Animation (Playing)"
                              style={{
                                width: "24px",
                                height: "24px",
                                objectFit: "contain"
                              }}
                            />
                          ) : (
                            // Show static frame when not playing
                            <img
                              src={aiAnimationStillFrame}
                              alt="AI Animation (Click to play)"
                              style={{
                                width: "24px",
                                height: "24px",
                                objectFit: "contain",
                                opacity: 0.9
                              }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {showDatePicker && (
                      <div className="card-body px-4 py-3">
                        <div className="d-flex flex-column gap-2">
                          <label>Select Date Range:</label>
                          <div className="d-flex gap-2 flex-wrap">
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

                    <div className="card-body p-4">
                      <p className="mb-4">
                        Select an outlet from the search menu above to view
                        detailed analytics and reports.
                      </p>
                      {/* Stats Cards */}
                      <div className="row g-4">
                        {loading ? (
                          <>
                            <StatCardSkeleton color="primary" />
                            <StatCardSkeleton color="success" />
                            <StatCardSkeleton color="warning" />
                            <StatCardSkeleton color="info" />
                            <StatCardSkeleton color="danger" />
                          </>
                        ) : (
                          <>
                            <StatCard
                              title="Total Orders"
                              value={statistics.total_orders}
                              icon="fas fa-shopping-cart"
                              color="primary"
                            />
                            <StatCard
                              title="Total Revenue"
                              value={`₹${statistics.total_revenue}`}
                              icon="fas fa-rupee-sign"
                              color="success"
                            />
                            {/* <StatCard
                              title="Customers count"
                              value={statistics.customer_count}
                              icon="fas fa-users"
                              color="warning"
                            /> */}
                            <StatCard
                              title="Average Order Value"
                              value={`₹${statistics.average_order_value.toFixed(2)}`}
                              icon="fas fa-chart-line"
                              color="info"
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
                    </div>
                  </div>
                </div>
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
                    <TopSell />
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
                    <WeeklyOrderStat/>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <OrderAnalytics />
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