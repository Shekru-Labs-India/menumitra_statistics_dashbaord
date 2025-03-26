import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import { useDashboard } from '../context/DashboardContext'; // Import context

const FoodTypeGraph = () => {
    // Get data from context
    const { 
      foodTypeStatistics_from_context,
      loading: contextLoading,
      error: contextError
    } = useDashboard();

    const [dateRange, setDateRange] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isGifPlaying, setIsGifPlaying] = useState(false);
    const [foodTypeData, setFoodTypeData] = useState([]);
    const [error, setError] = useState('');
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
      if (foodTypeStatistics_from_context && foodTypeStatistics_from_context.weeks) {
        // Map the context data to the chart format
        const weeks = foodTypeStatistics_from_context.weeks;
        
        // Map the API weeks data to our chart format
        const chartData = weeks.map(week => ({
          week: week.week,
          Veg: week.veg || 0,
          "Non-Veg": week.nonveg || 0,
          Vegan: week.vegan || 0,
          Eggs: week.egg || 0
        }));
        
        // If we have less than 4 weeks, fill in the missing weeks with zeros
        const weekNames = ["Week 1", "Week 2", "Week 3", "Week 4"];
        
        // Check which weeks we already have
        const existingWeeks = chartData.map(data => data.week);
        
        // Add any missing weeks with zero values
        weekNames.forEach(weekName => {
          if (!existingWeeks.includes(weekName)) {
            chartData.push({
              week: weekName,
              Veg: 0,
              "Non-Veg": 0,
              Vegan: 0,
              Eggs: 0
            });
          }
        });
        
        // Sort the data by week number to ensure correct order
        chartData.sort((a, b) => {
          const weekNumA = parseInt(a.week.split(' ')[1]);
          const weekNumB = parseInt(b.week.split(' ')[1]);
          return weekNumA - weekNumB;
        });
        
        setFoodTypeData(chartData);
      }
    }, [foodTypeStatistics_from_context]);

    // Set error from context if available
    useEffect(() => {
      if (contextError && !userInteracted) {
        setError(contextError);
      }
    }, [contextError, userInteracted]);

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
            // Set user interaction flag to true
            setUserInteracted(true);
            
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
            if (range === 'Today') {
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

            console.log('Sending request to food_type_statistics with data:', requestData);
            
            // Make API request
            const response = await axios.post(`${apiEndpoint}food_type_statistics`, requestData, {
                headers: getAuthHeaders()
            });
            
            console.log('API Response:', response.data);
            
            if (response.data && response.data.data && response.data.data.weeks) {
                // The API now returns weekly data in the response
                const { weeks } = response.data.data;
                
                // Map the API weeks data to our chart format
                const chartData = weeks.map(week => ({
                    week: week.week,
                    Veg: week.veg || 0,
                    "Non-Veg": week.nonveg || 0,
                    Vegan: week.vegan || 0,
                    Eggs: week.egg || 0
                }));
                
                // If we have less than 4 weeks, fill in the missing weeks with zeros
                const weekNames = ["Week 1", "Week 2", "Week 3", "Week 4"];
                
                // Check which weeks we already have
                const existingWeeks = chartData.map(data => data.week);
                
                // Add any missing weeks with zero values
                weekNames.forEach(weekName => {
                    if (!existingWeeks.includes(weekName)) {
                        chartData.push({
                            week: weekName,
                            Veg: 0,
                            "Non-Veg": 0,
                            Vegan: 0,
                            Eggs: 0
                        });
                    }
                });
                
                // Sort the data by week number to ensure correct order
                chartData.sort((a, b) => {
                    const weekNumA = parseInt(a.week.split(' ')[1]);
                    const weekNumB = parseInt(b.week.split(' ')[1]);
                    return weekNumA - weekNumB;
                });
                
                setFoodTypeData(chartData);
            } else {
                // If no data or incorrect format, show default data
                setError('No data available for the selected date range');
                setFoodTypeData([
                    { week: "Week 1", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                    { week: "Week 2", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                    { week: "Week 3", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                    { week: "Week 4", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch food type statistics:', error);
            const errorMessage = handleApiError(error);
            setError(errorMessage || 'Failed to fetch food type statistics. Please try again.');
            
            // Use default data on error
            setFoodTypeData([
                { week: "Week 1", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                { week: "Week 2", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                { week: "Week 3", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
                { week: "Week 4", Veg: 0, "Non-Veg": 0, Vegan: 0, Eggs: 0 },
            ]);
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

    // Determine current loading state
    const isLoading = userInteracted ? loading : contextLoading;
    // Determine current error state
    const currentError = userInteracted ? error : contextError;

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
                <h5 className="card-title mb-0">Food Type Analysis</h5>
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
                            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Current Month', 'Last Month'].map((range) => (
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
                        className={`btn btn-icon p-0 ${isLoading ? 'disabled' : ''}`}
                        onClick={handleReload}
                        disabled={isLoading}
                        style={{ border: '1px solid var(--bs-primary)' }}
                    >
                        <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
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
            
            {currentError && (
                <div className="card-body">
                    <div className="alert alert-danger" role="alert">
                        {currentError}
                    </div>
                </div>
            )}
            
            <div className="card-body">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={foodTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="week" stroke="#433c50" />
                            <YAxis stroke="#433c50" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff',
                                    border: '1px solid #8c57ff',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="Veg" stackId="a" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Non-Veg" stackId="a" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Vegan" stackId="a" fill="#FFBF00" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Eggs" stackId="a" fill="#9e9e9e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

export default FoodTypeGraph