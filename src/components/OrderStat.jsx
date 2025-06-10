import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import { useDashboard } from '../context/DashboardContext'; // Import context

const OrderStat = () => {
    // Get data from context
    const { 
      orderStatistics_from_context,
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
    const [orderStats, setOrderStats] = useState({
        success_orders: 0,
        cancelled_orders: 0,
        complementary_orders: 0,
        KOT_orders: 0
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

    // Use context data when component mounts
    useEffect(() => {
        if (orderStatistics_from_context) {
            setOrderStats({
                success_orders: orderStatistics_from_context.success_orders || 0,
                cancelled_orders: orderStatistics_from_context.cancelled_orders || 0,
                complementary_orders: orderStatistics_from_context.complementary_orders || 0,
                KOT_orders: orderStatistics_from_context.KOT_orders || 0
            });
        }
    }, [orderStatistics_from_context]);

    // Set error from context if available
    useEffect(() => {
        if (contextError && !userInteracted) {
            setError(contextError);
        }
    }, [contextError, userInteracted]);

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
        setDateRange(range);
        setShowDatePicker(range === 'Custom Range');
        if (range !== 'Custom Range') {
            // Reset custom date range when another option is selected
            setStartDate(null);
            setEndDate(null);
            fetchData(range);
        }
    };

    const handleReload = () => {
        // Set user interaction flag to true
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
            
            // Prepare request data
            const requestData = {
                outlet_id: localStorage.getItem('outlet_id'),
                device_token: localStorage.getItem('device_token') || '',
                device_id: localStorage.getItem('device_id') || ''
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

            // Get authentication token
            const accessToken = localStorage.getItem('access');
            
            // Make API request
            const response = await axios.post(
                'https://men4u.xyz/1.3/outlet_statistics/order_statistics',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': accessToken ? `Bearer ${accessToken}` : ''
                    }
                }
            );

            if (response.data?.data) {
                // Process the response data
                const data = response.data.data;
                setOrderStats({
                    success_orders: data.success_orders || 0,
                    cancelled_orders: data.cancelled_orders || 0,
                    complementary_orders: data.complementary_orders || 0,
                    KOT_orders: data.KOT_orders || 0
                });
            } else {
                console.error('No data available in response');
                setError('No data available');
            }
        } catch (error) {
            console.error('Failed to fetch order statistics:', error);
            setError('Failed to fetch order statistics');
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

    // Generate metrics based on API response data
    const getMetrics = () => [
      {
        title: "Success Order",
        value: orderStats.success_orders.toString(),
        // subtitle: "Success Order",
      },
      {
        title: "Cancelled Order",
        value: orderStats.cancelled_orders.toString(),
        // subtitle: "Cancelled Order",
      },
      {
        title: "Complimentary Order",
        value: orderStats.complementary_orders.toString(),
        // subtitle: "Complimentary Order",
      },
      {
        title: "Kitchen Order token (KOT)",
        value: orderStats.KOT_orders.toString(),
        // subtitle: "Kitchen Order token",
      },
    ];

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
                <h5 className="card-title mb-0">Order Statistics</h5>
            </div>

            <div className="card-body">
                <div className="row g-4">
                    <div className="position-relative w-100">
                        <div className="row g-4">
                            {getMetrics().map((metric, index) => (
                                <div key={index} className="col-md-6">
                                    <div className="d-flex flex-column p-3 rounded" style={{ background: '#f3f3f3', position: 'relative' }}>
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderStat;
