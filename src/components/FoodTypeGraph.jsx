import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import Chart from 'react-apexcharts';
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

    const [dateRange, setDateRange] = useState('All time');
    const [loading, setLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false); // New state for reload action
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isGifPlaying, setIsGifPlaying] = useState(false);
    const [foodTypeData, setFoodTypeData] = useState([]);
    const [error, setError] = useState('');
    const [userInteracted, setUserInteracted] = useState(false); // Flag to track user interaction
    const [showModal, setShowModal] = useState(false); // New state for modal
  
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
      if (foodTypeStatistics_from_context) {
        processFoodTypeData(foodTypeStatistics_from_context);
      }
    }, [foodTypeStatistics_from_context]);

    // Set error from context if available
    useEffect(() => {
      if (contextError && !userInteracted) {
        setError(contextError);
      }
    }, [contextError, userInteracted]);

    // Function to get week date range
    const getWeekDateRange = (weeksAgo = 0) => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust to make Monday the first day
        
        // Calculate the start of the current week (Monday)
        const startOfCurrentWeek = new Date(today);
        startOfCurrentWeek.setDate(today.getDate() - diff);
        
        // Calculate the start of the target week
        const startOfTargetWeek = new Date(startOfCurrentWeek);
        startOfTargetWeek.setDate(startOfCurrentWeek.getDate() - (weeksAgo * 7));
        
        // Calculate the end of the target week (Sunday)
        const endOfTargetWeek = new Date(startOfTargetWeek);
        endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6);
        
        return {
            start: startOfTargetWeek,
            end: endOfTargetWeek
        };
    };

    // Function to format date range string
    const formatDateRangeString = (start, end) => {
        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            return `${day} ${month}`;
        };
        
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    // Function to get date range options
    const getDateRangeOptions = () => {
        const options = [];
        
        // All time option
        options.push({
            label: 'All time',
            value: 'All time',
            dateRange: null
        });
        
        // This week
        const thisWeek = getWeekDateRange(0);
        options.push({
            label: 'This week',
            value: 'This week',
            dateRange: formatDateRangeString(thisWeek.start, thisWeek.end)
        });
        
        // Last week
        const lastWeek = getWeekDateRange(1);
        options.push({
            label: 'Last week',
            value: 'Last week',
            dateRange: formatDateRangeString(lastWeek.start, lastWeek.end)
        });
        
        // Previous weeks (up to 4 weeks ago)
        for (let i = 2; i <= 4; i++) {
            const week = getWeekDateRange(i);
            options.push({
                label: formatDateRangeString(week.start, week.end),
                value: `Week ${i}`,
                dateRange: formatDateRangeString(week.start, week.end)
            });
        }
        
        // Custom range
        options.push({
            label: 'Custom Range',
            value: 'Custom Range',
            dateRange: null
        });
        
        return options;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const processFoodTypeData = (data) => {
        if (!data) {
            console.log('No data received for processing');
            setFoodTypeData([]);
            return;
        }

        console.log('Raw data received:', data);

        // Check if the outlet has any non-veg items
        const hasNonVegItems = Object.values(data).some(dayData => 
            (dayData.nonveg && dayData.nonveg > 0) || (dayData.egg && dayData.egg > 0)
        );

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const chartData = days.map(day => {
            const dayData = data[day] || {};
            console.log(`Processing ${day} data:`, dayData);

            // For veg-only outlets, only include veg and vegan data
            if (!hasNonVegItems) {
                return {
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    Veg: dayData.veg || 0,
                    Vegan: dayData.vegan || 0
                };
            }

            // For non-veg outlets, include all categories in specific order
            return {
                day: day.charAt(0).toUpperCase() + day.slice(1),
                Veg: dayData.veg || 0,
                "Non-Veg": dayData.nonveg || 0,
                Vegan: dayData.vegan || 0,
                Eggs: dayData.egg || 0
            };
        });
        
        console.log('Final chart data:', chartData);
        setFoodTypeData(chartData);

        // Update chart colors based on outlet type
        const colors = !hasNonVegItems ? 
            ['#2e7d32', '#FFBF00'] :  // For veg outlets: Veg (green), Vegan (yellow)
            ['#2e7d32', '#d32f2f', '#FFBF00', '#9e9e9e'];  // For non-veg outlets: Veg (green), Non-Veg (red), Vegan (yellow), Eggs (grey)
        
        chartOptions.fill.colors = colors;
    };

    // Function to get date range
    const getDateRange = (range) => {
        const today = new Date();
        let start, end;
        
        switch (range) {
            case 'This week': {
                const firstDayOfWeek = new Date(today);
                const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
                const diff = day === 0 ? 6 : day - 1; // Adjust to make Monday the first day
                firstDayOfWeek.setDate(today.getDate() - diff);
                start = firstDayOfWeek;
                end = today;
                break;
            }
            case 'Last week': {
                const lastWeekEnd = new Date(today);
                const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
                const diff = day === 0 ? 6 : day - 1; // Adjust to make Monday the first day
                lastWeekEnd.setDate(today.getDate() - diff - 1); // End of previous week (Sunday)
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Start of previous week (Monday)
                start = lastWeekStart;
                end = lastWeekEnd;
                break;
            }
            case 'Week 2': {
                const week = getWeekDateRange(2);
                start = week.start;
                end = week.end;
                break;
            }
            case 'Week 3': {
                const week = getWeekDateRange(3);
                start = week.start;
                end = week.end;
                break;
            }
            case 'Week 4': {
                const week = getWeekDateRange(4);
                start = week.start;
                end = week.end;
                break;
            }
            default:
                return null;
        }
        
        return {
            start_date: formatDate(start),
            end_date: formatDate(end)
        };
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
        setIsGifPlaying(true);
        
        // Always fetch fresh data on reload, regardless of the date range
        fetchData(dateRange);
    };

    // Function to prepare request data based on date range
    const prepareRequestData = (range) => {
        const today = new Date();
        
        const getDateRange = (range) => {
            switch(range) {
                case 'All time': {
                    // For all time, we'll send an empty date range to get all data
                    return {
                        start_date: '',
                        end_date: ''
                    };
                }
                case 'This week': {
                    const firstDayOfWeek = new Date(today);
                    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
                    const diff = day === 0 ? 6 : day - 1; // Adjust to make Monday the first day
                    firstDayOfWeek.setDate(today.getDate() - diff);
                    return {
                        start_date: formatDate(firstDayOfWeek),
                        end_date: formatDate(today)
                    };
                }
                case 'Last week': {
                    const lastWeekEnd = new Date(today);
                    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
                    const diff = day === 0 ? 6 : day - 1; // Adjust to make Monday the first day
                    lastWeekEnd.setDate(today.getDate() - diff - 1); // End of previous week (Sunday)
                    const lastWeekStart = new Date(lastWeekEnd);
                    lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Start of previous week (Monday)
                    return {
                        start_date: formatDate(lastWeekStart),
                        end_date: formatDate(lastWeekEnd)
                    };
                }
                case 'Week 2':
                case 'Week 3':
                case 'Week 4': {
                    const weekNumber = parseInt(range.split(' ')[1]);
                    const week = getWeekDateRange(weekNumber);
                    return {
                        start_date: formatDate(week.start),
                        end_date: formatDate(week.end)
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
                    return {};
                }
            }
        };

        return getDateRange(range);
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
                device_id: localStorage.getItem('device_id')
            };

            if (range === 'Custom Range' && startDate && endDate) {
                requestData.start_date = formatDate(startDate);
                requestData.end_date = formatDate(endDate);
            } else if (range !== 'All time') {
                const dateRange = getDateRange(range);
                if (dateRange) {
                    requestData.start_date = dateRange.start_date;
                    requestData.end_date = dateRange.end_date;
                }
            }

            const response = await axios.post(
                `${apiEndpoint}food_type_statistics`,
                requestData,
                {
                    headers: getAuthHeaders()
                }
            );
            
            if (response.data?.data) {
                processFoodTypeData(response.data.data);
            } else {
                setError('No data available for the selected period');
                setFoodTypeData([]);
            }
        } catch (error) {
            console.error('API Error:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to fetch data');
            } else {
                setError('Failed to connect to server');
            }
            setFoodTypeData([]);
        } finally {
            if (isReloadAction) {
                setIsReloading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleCustomDateSelect = () => {
        if (startDate && endDate) {
            console.log('Custom date range selected:', formatDate(startDate), 'to', formatDate(endDate));
            setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
            setShowDatePicker(false);
            fetchData('Custom Range');
        }
    };

    // Determine current loading state
    const isLoading = userInteracted ? loading : contextLoading;
    // Determine current error state
    const currentError = userInteracted ? error : contextError;

    const categoryColors = {
        'Veg': '#2e7d32',     // green
        'Non-Veg': '#d32f2f', // red
        'Vegan': '#FFBF00',   // yellow
        'Eggs': '#9e9e9e'     // grey
    };

    const chartSeries = !foodTypeData.length ? [] :
        Object.keys(foodTypeData[0])
            .filter(key => key !== 'day')
            .map(category => ({
                name: category,
                data: foodTypeData.map(item => item[category]),
                color: categoryColors[category]
            }));

    const chartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
                distributed: false,
                dataLabels: {
                    position: 'center'
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return Math.round(val);
            },
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: foodTypeData.map(item => item.day),
            labels: {
                style: {
                    colors: '#433c50',
                    fontSize: '12px'
                },
                axisBorder: {
                    show: true
                },
                axisTicks: {
                    show: true
                }
            }
        },
        yaxis: {
            show: true,
            labels: {
                formatter: function(val) {
                    return Math.round(val);
                },
                style: {
                    colors: '#433c50',
                    fontSize: '12px'
                }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: -10,
            labels: {
                colors: '#433c50',
                useSeriesColors: true
            },
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return Math.round(val);
                }
            },
            shared: true,
            intersect: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    console.log('Chart series data:', chartSeries);

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
                            {getDateRangeOptions().map((option) => (
                                <li key={option.value}>
                                    <a
                                        href="javascript:void(0);"
                                        className="dropdown-item d-flex align-items-center"
                                        onClick={() => handleDateRangeChange(option.value)}
                                    >
                                        <div className="d-flex flex-column">
                                            <span>{option.label}</span>
                                            {option.dateRange && (
                                                <small className="text-muted">{option.dateRange}</small>
                                            )}
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="button"
                        className={`btn btn-icon p-0 ${isReloading ? 'disabled' : ''}`}
                        onClick={() => fetchData(dateRange, true)}
                        disabled={isReloading}
                        style={{ border: '1px solid var(--bs-primary)' }}
                    >
                        <i className={`fas fa-sync-alt ${isReloading ? 'fa-spin' : ''}`}></i>
                    </button>

                    {/* <button
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
                        {isGifPlaying ? (
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
                    </button> */}
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
                    <div className="position-relative">
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
                        <div className={isReloading ? 'opacity-50' : ''}>
                            <button
                                type="button"
                                className="btn btn-icon btn-sm btn-outline-primary position-absolute"
                                style={{ 
                                    top: '-5px', 
                                    right: '3px',
                                    zIndex: 1
                                }}
                                onClick={() => setShowModal(true)}
                                title="Expand Graph"
                            >
                                <i className="fas fa-expand"></i>
                            </button>
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={400}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for expanded graph */}
            {showModal && (
                <div 
                    className="modal fade show" 
                    tabIndex="-1" 
                    role="dialog"
                    style={{ 
                        display: 'block',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Food Type Analysis</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <Chart
                                    options={{
                                        ...chartOptions,
                                        chart: {
                                            ...chartOptions.chart,
                                            toolbar: {
                                                show: true,
                                                tools: {
                                                    download: true,
                                                    selection: true,
                                                    zoom: true,
                                                    zoomin: true,
                                                    zoomout: true,
                                                    pan: true,
                                                }
                                            }
                                        }
                                    }}
                                    series={chartSeries}
                                    type="bar"
                                    height={600}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodTypeGraph;