import React, { useState, useEffect } from "react";
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import 'remixicon/fonts/remixicon.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';

// Placeholder data for when API fails or is loading
const placeholderOrderTypes = [
  { 
    name: "Dine In", 
    icon: "fas fa-utensils",
    count: 0,
    trend: "0%",
    trendUp: true,
    color: "primary"
  },
  { 
    name: "Drive Through", 
    icon: "fas fa-car",
    count: 0,
    trend: "0%",
    trendUp: true,
    color: "info"
  },
  { 
    name: "Parcel", 
    icon: "fas fa-box",
    count: 0,
    trend: "0%",
    trendUp: true,
    color: "success"
  },
  { 
    name: "Delivery", 
    icon: "fas fa-globe",
    count: 0,
    trend: "0%",
    trendUp: true,
    color: "warning"
  },
];

const OrderType = () => {
  const [dateRange, setDateRange] = useState('All Time');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [orderTypes, setOrderTypes] = useState(placeholderOrderTypes);
  const [error, setError] = useState('');

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

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === 'Custom Range');
    if (range !== 'Custom Range') {
      fetchData(range);
    }
  };

  const handleReload = () => {
    setLoading(true);
    fetchData(dateRange);
  };

  const fetchData = async (range) => {
    try {
      setLoading(true);
      setError('');
      
      let requestData = {};
      const today = new Date();
      const outletId = localStorage.getItem('outlet_id');
      
      if (!outletId) {
        console.error('No outlet ID found in localStorage');
        setError('No outlet ID found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Add outlet_id to request data
      requestData.outlet_id = outletId;
      
      // Handle different date range options
      if (range === 'All Time') {
        // Don't add date range for All Time
      } else if (range === 'Today') {
        // Today - both start and end are today
        requestData.start_date = formatDate(today);
        requestData.end_date = formatDate(today);
      } else if (range === 'Yesterday') {
        // Yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        requestData.start_date = formatDate(yesterday);
        requestData.end_date = formatDate(yesterday);
      } else if (range === 'Last 7 Days') {
        // Last 7 Days
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6); // -6 because it includes today
        requestData.start_date = formatDate(sevenDaysAgo);
        requestData.end_date = formatDate(today);
      } else if (range === 'Last 30 Days') {
        // Last 30 Days
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29); // -29 because it includes today
        requestData.start_date = formatDate(thirtyDaysAgo);
        requestData.end_date = formatDate(today);
      } else if (range === 'Current Month') {
        // Current Month - from 1st of current month to today
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        requestData.start_date = formatDate(firstDayOfMonth);
        requestData.end_date = formatDate(today);
      } else if (range === 'Last Month') {
        // Last Month - from 1st to last day of previous month
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        requestData.start_date = formatDate(firstDayOfLastMonth);
        requestData.end_date = formatDate(lastDayOfLastMonth);
      } else if (range === 'Custom Range' && startDate && endDate) {
        // Custom Range - use the selected dates
        requestData.start_date = formatDate(startDate);
        requestData.end_date = formatDate(endDate);
      } else {
        // Default to today if something goes wrong
        requestData.start_date = formatDate(today);
        requestData.end_date = formatDate(today);
      }

      console.log('Sending request to order_type_statistics with data:', requestData);
      
      // Make API request
      const response = await axios.post(`${apiEndpoint}order_type_statistics`, requestData, {
        headers: getAuthHeaders()
      });
      
      console.log('API Response:', response.data);
      console.log('Response structure:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.message === "success" && response.data.data) {
        // The API returns a different structure than expected
        // It has a nested 'data' object with direct properties for each order type
        const responseData = response.data.data;
        console.log('Order type data:', responseData);
        
        // Convert the flat object structure to the array format our component expects
        const orderTypesArray = [
          {
            name: "Dine In",
            icon: "fas fa-utensils",
            count: responseData["dine-in"] || 0,
            trend: "0%", // We don't have trend data in the response
            trendUp: true,
            color: "primary"
          },
          {
            name: "Drive Through",
            icon: "fas fa-car",
            count: responseData["drive-through"] || 0,
            trend: "0%",
            trendUp: true,
            color: "info"
          },
          {
            name: "Parcel",
            icon: "fas fa-box",
            count: responseData["parcel"] || 0,
            trend: "0%",
            trendUp: true,
            color: "success"
          },
          {
            name: "Delivery",
            icon: "fas fa-globe",
            count: responseData["delivery"] || 0,
            trend: "0%",
            trendUp: true,
            color: "warning"
          }
        ];
        
        // Add counter type if it exists in the response
        if (responseData["counter"] !== undefined) {
          orderTypesArray.push({
            name: "Counter",
            icon: "fas fa-cash-register",
            count: responseData["counter"] || 0,
            trend: "0%",
            trendUp: true,
            color: "danger"
          });
        }
        
        console.log('Processed order types:', orderTypesArray);
        setOrderTypes(orderTypesArray);
      } else {
        // If no data is returned, use placeholder data
        console.warn('Invalid response format or empty data');
        setOrderTypes(placeholderOrderTypes);
      }
    } catch (error) {
      console.error('Failed to fetch order type statistics:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage || 'Failed to fetch order type statistics. Please try again.');
      
      // Use placeholder data on error
      setOrderTypes(placeholderOrderTypes);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchData('Custom Range');
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    const outletId = localStorage.getItem('outlet_id');
    if (outletId) {
      fetchData('All Time');
    } else {
      setError('No outlet ID found. Please log in again.');
      setLoading(false);
    }
  }, []);

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

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">Order Types Overview</h5>
        <div className="d-flex gap-2">
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
              {['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Current Month', 'Last Month'].map((range) => (
                <li key={range}>
                  <a href="javascript:void(0);"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleDateRangeChange(range)}>
                    {range}
                  </a>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a href="javascript:void(0);"
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleDateRangeChange('Custom Range')}>
                  Custom Range
                </a>
              </li>
            </ul>
          </div>
          <button 
            type="button" 
            className={`btn btn-icon p-0 ${loading ? 'disabled' : ''}`}
            onClick={handleReload}
            disabled={loading}
            style={{ border: '1px solid var(--bs-primary)' }}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          </button>

          <button
            type="button"
            className="btn btn-icon btn-sm p-0"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #e9ecef'
            }}
            onClick={() => setIsGifPlaying(true)}
            title={isGifPlaying ? "Animation playing" : "Click to play animation"}
          >
            {/* Using two separate images - static frame and animated */}
            {isGifPlaying ? (
                // Show animated GIF when playing
                <img 
                    src={aiAnimationGif} 
                    alt="AI Animation (Playing)"
                    style={{ 
                        width: '24px', 
                        height: '24px',
                        objectFit: 'contain'
                    }}
                />
            ) : (
                // Show static frame when not playing
                <img 
                    src={aiAnimationStillFrame} 
                    alt="AI Animation (Click to play)"
                    style={{ 
                        width: '24px', 
                        height: '24px',
                        objectFit: 'contain',
                        opacity: 0.9
                    }}
                />
            )}
          </button>
        </div>
      </div>

      {showDatePicker && (
        <div className="card-body">
          <div className="d-flex flex-column gap-2">
            <label>Select Date Range:</label>
            <div className="d-flex gap-2">
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
            <button className="btn btn-primary mt-2" onClick={handleCustomDateSelect} disabled={!startDate || !endDate}>
              Apply
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="row g-3">
          {loading ? (
            // Display skeleton loading for 4 order type cards
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="col-md-4 col-sm-6">
                <div className="card shadow-none bg-label-secondary h-100 position-relative overflow-hidden">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <div className="rounded-2 avatar avatar-sm me-2 bg-secondary d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', opacity: 0.5 }}></div>
                      <span className="bg-secondary" style={{ width: '80px', height: '20px', opacity: 0.5 }}></span>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="bg-secondary me-2" style={{ width: '30px', height: '24px', opacity: 0.5 }}></div>
                      <div className="bg-secondary" style={{ width: '50px', height: '20px', opacity: 0.5 }}></div>
                    </div>
                    <div className="bg-secondary mt-1" style={{ width: '70px', height: '15px', opacity: 0.5 }}></div>
                  </div>
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Display actual order type data
            orderTypes.map((order, index) => (
              <div key={index} className="col-md-4 col-sm-6">
                <div className={`card shadow-none bg-label-${order.color} h-100`}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`rounded-2 avatar avatar-sm me-2 bg-${order.color} d-flex align-items-center justify-content-center`} style={{ width: '35px', height: '35px' }}>
                        <i className={`${order.icon} text-white`} style={{ fontSize: '1rem' }}></i>
                      </div>
                      <span className="fw-semibold">{order.name}</span>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <h4 className="mb-0 me-2">{order.count}</h4>
                      {/* <small className={`${order.trendUp ? 'text-success' : 'text-danger'} fw-semibold`}>
                        <i className={`fas fa-arrow-${order.trendUp ? 'up' : 'down'}`}></i>
                        {order.trend}
                      </small> */}
                    </div>
                    <small className="text-muted">Total Orders</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderType;
