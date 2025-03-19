import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';

const OrderStat = () => {
    const [dateRange, setDateRange] = useState('All Time');
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isGifPlaying, setIsGifPlaying] = useState(false);
    const [error, setError] = useState('');
    const [orderStats, setOrderStats] = useState({
        success_orders: 0,
        cancelled_orders: 0,
        complementary_orders: 0,
        KOT_orders: 0
    });
  
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

            console.log('Sending request to order_statistics with data:', requestData);
            
            // Make API request
            const response = await axios.post(`${apiEndpoint}order_statistics`, requestData, {
                headers: getAuthHeaders()
            });
            
            console.log('API Response:', response.data);
            console.log('Response structure:', JSON.stringify(response.data, null, 2));
            
            if (response.data && response.data.message === "success" && response.data.data) {
                // The API returns a nested data object with order statistics
                const responseData = response.data.data;
                console.log('Order statistics data:', responseData);
                
                setOrderStats({
                    success_orders: responseData.success_orders || 0,
                    cancelled_orders: responseData.cancelled_orders || 0,
                    complementary_orders: responseData.complementary_orders || 0,
                    KOT_orders: responseData.KOT_orders || 0
                });
            } else {
                console.warn('Invalid response format or empty data');
                setError('Received invalid data from server');
            }
        } catch (error) {
            console.error('Failed to fetch order statistics:', error);
            const errorMessage = handleApiError(error);
            setError(errorMessage || 'Failed to fetch order statistics. Please try again.');
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

    // Generate metrics based on API response data
    const getMetrics = () => [
        { 
            title: 'Success Order', 
            value: orderStats.success_orders.toString(), 
            subtitle: 'Success Order' 
        },
        { 
            title: 'Cancelled Order', 
            value: orderStats.cancelled_orders.toString(), 
            subtitle: 'Cancelled Order' 
        },
        { 
            title: 'Complimentary Order', 
            value: orderStats.complementary_orders.toString(), 
            subtitle: 'Complimentary Order' 
        },
        { 
            title: 'Kitchen Order token (KOT)', 
            value: orderStats.KOT_orders.toString(), 
            subtitle: 'Kitchen Order token' 
        }
    ];

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
                <h5 className="card-title mb-0">Order Statistics</h5>
                <div className="d-flex align-items-center gap-2 ">
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
                <div className="row g-4">
                    {loading ? (
                        // Loading skeletons for metrics
                        Array(4).fill(0).map((_, index) => (
                            <div key={index} className="col-md-6">
                                <div className="d-flex flex-column p-3 bg-label-primary rounded position-relative overflow-hidden" style={{ minHeight: '120px' }}>
                                    <div className="bg-secondary mb-2" style={{ width: '120px', height: '20px', opacity: 0.5 }}></div>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary rounded me-2" style={{ width: '4px', height: '40px', opacity: 0.5 }}></div>
                                        <div>
                                            <div className="bg-secondary mb-1" style={{ width: '50px', height: '24px', opacity: 0.5 }}></div>
                                            <div className="bg-secondary" style={{ width: '80px', height: '16px', opacity: 0.5 }}></div>
                                        </div>
                                    </div>
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Display actual metrics
                        getMetrics().map((metric, index) => (
                            <div key={index} className="col-md-6">
                                <div className="d-flex flex-column p-3 bg-label-primary rounded">
                                    <div className="text-heading mb-2">{metric.title}</div>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary rounded me-2" style={{ width: '4px', height: '40px' }}></div>
                                        <div>
                                            <h4 className="mb-0 text-heading fw-medium fs-4">{metric.value}</h4>
                                            <small className="text-muted">{metric.subtitle}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderStat;
