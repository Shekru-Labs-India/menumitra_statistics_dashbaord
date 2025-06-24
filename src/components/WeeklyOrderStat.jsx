import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import { useDashboard } from '../context/DashboardContext'; // Import context

const WeeklyOrderStat = () => {
  // Get data from context
  const {
    weeklyOrderStats_from_context,
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
  const [days, setDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [orderData, setOrderData] = useState([]);
  const [peakDay, setPeakDay] = useState('');
  const [lowPeakDay, setLowPeakDay] = useState('');
  const [maxOrders, setMaxOrders] = useState(0);
  const [minOrders, setMinOrders] = useState(0);
  const [error, setError] = useState('');
  const [userInteracted, setUserInteracted] = useState(false); // Flag to track user interaction

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

  // Use context data when component mounts
  useEffect(() => {
    if (weeklyOrderStats_from_context) {
      const { data, peak_day, low_day } = weeklyOrderStats_from_context;
      
      // Transform the data into the required format
      const days = data.map(item => item[0]);
      const orderCounts = data.map(item => parseInt(item[1]));
      
      setDays(days);
      setOrderData(orderCounts);
      
      // Set peak day information
      if (peak_day && peak_day.length === 2) {
        setPeakDay(peak_day[0]);
        setMaxOrders(parseInt(peak_day[1]));
      }
      
      // Set low day information
      if (low_day && low_day.length === 2) {
        setLowPeakDay(low_day[0]);
        setMinOrders(parseInt(low_day[1]));
      }
      
      setError('');
    }
  }, [weeklyOrderStats_from_context]);

  // Set error from context if available
  useEffect(() => {
    if (contextError && !userInteracted) {
      setError(contextError);
    }
  }, [contextError, userInteracted]);

  // Add event listener for header reload
  useEffect(() => {
    const handleHeaderReload = () => {
      setDateRange('All time');
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(false);
      setUserInteracted(false);
      fetchWeeklyOrderStats('All time');
    };

    window.addEventListener('resetFiltersToAllTime', handleHeaderReload);
    return () => window.removeEventListener('resetFiltersToAllTime', handleHeaderReload);
  }, []);

  // Date formatting function
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Function to fetch weekly order stats
  const fetchWeeklyOrderStats = async (range = 'This Week', isReloadAction = false) => {
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
        device_token: localStorage.getItem('device_token') || '',
        device_id: localStorage.getItem('device_id') || '',
        ...prepareRequestData(range)
      };
      
      const response = await axios.post(
        'https://menusmitra.xyz/1.3/outlet_statistics/weekly_order_stats',
        requestData,
        { 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        }
      );

      if (response.data?.data) {
        const { data, peak_day, low_day } = response.data;
        
        // Transform the data into the required format
        const days = data.map(item => item[0]);
        const orderCounts = data.map(item => parseInt(item[1]));
        
        setDays(days);
        setOrderData(orderCounts);
        
        // Set peak day information
        if (peak_day && peak_day.length === 2) {
          setPeakDay(peak_day[0]);
          setMaxOrders(parseInt(peak_day[1]));
        }
        
        // Set low day information
        if (low_day && low_day.length === 2) {
          setLowPeakDay(low_day[0]);
          setMinOrders(parseInt(low_day[1]));
        }
        
        setError('');
      } else {
        setError('No data available for the selected period');
        // Reset data
        setDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
        setOrderData([0, 0, 0, 0, 0, 0, 0]);
        setPeakDay('');
        setLowPeakDay('');
        setMaxOrders(0);
        setMinOrders(0);
      }
    } catch (error) {
      console.error('Failed to fetch weekly order stats:', error);
      setError('Failed to load weekly order statistics. Please try again.');
      // Reset data on error
      setDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      setOrderData([0, 0, 0, 0, 0, 0, 0]);
      setPeakDay('');
      setLowPeakDay('');
      setMaxOrders(0);
      setMinOrders(0);
    } finally {
      if (isReloadAction) {
        setIsReloading(false);
      } else {
        setLoading(false);
      }
    }
  };

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

  // Function to prepare request data based on date range
  const prepareRequestData = useMemo(() => (range) => {
    const today = new Date();
    
    const getDateRange = (range) => {
      switch(range) {
        case 'All time': {
          // For all time, we don't need to set any date range
          return {};
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
  }, [startDate, endDate]);

  // Determine current loading state
  const isLoading = userInteracted ? loading : contextLoading;
  // Determine current error state
  const currentError = userInteracted ? error : contextError;

  // Colors for each day (Monday to Sunday)
  const dayColors = [
    '#9bbb59', // Monday - green
    '#c0504d', // Tuesday - pink
    '#d8c878', // Wednesday - gold
    '#8064a2', // Thursday - purple
    '#4bacc6', // Friday - teal
    '#c0504d', // Saturday - red
    '#4f81bd', // Sunday - blue
  ];

  // ApexCharts options
  const chartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      fontFamily: 'Helvetica, Arial, sans-serif',
      background: 'transparent',
      parentHeightOffset: 0
    },
    colors: dayColors,
    fill: {
      opacity: 1
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '65%',
        distributed: true,
        endingShape: 'flat'
      }
    },
    grid: {
      borderColor: 'rgba(0, 0, 0, 0.05)',
      row: {
        colors: ['transparent'],
        opacity: 0.2
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 30,
        left: 10
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.15
        }
      }
    },
    xaxis: {
      categories: days,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          colors: days.map(() => '#000000')
        },
        rotate: -45,
        offsetY: 5,
        trim: false
      },
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      }
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#454545'
        }
      },
      min: 0,
      max: orderData.length > 0 ? Math.max(...orderData) * 1.2 : 500,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          colors: '#5a5a5a'
        },
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },

    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial, sans-serif'
      },
      y: {
        formatter: function(val) {
          return val;
        }
      }
    },
    title: {
      text: 'Weekly Order Distribution',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#2c2c2c'
      },
      offsetY: 10,
      offsetX: 10
    },
    // annotations: {
    //   points: [
    //     {
    //       x: peakDay,
    //       y: maxOrders,
    //       marker: {
    //         size: 10,
    //         fillColor: '#fff',
    //         strokeColor: '#ff4560',
    //         strokeWidth: 2,
    //         radius: 20
    //       },
    //       label: {
    //         borderColor: '#ff4560',
    //         offsetY: -15,
    //         style: {
    //           color: '#fff',
    //           background: '#ff4560',
    //           padding: {
    //             left: 10,
    //             right: 10,
    //             top: 5,
    //             bottom: 5
    //           },
    //           borderRadius: 5,
    //           fontSize: '12px',
    //           fontWeight: 'bold'
    //         },
    //         text: 'Peak Day'
    //       }
    //     },
    //     {
    //       x: lowPeakDay,
    //       y: minOrders,
    //       marker: {
    //         size: 10,
    //         fillColor: '#fff',
    //         strokeColor: '#00e396',
    //         strokeWidth: 2,
    //         radius: 20
    //       },
    //       label: {
    //         borderColor: '#00e396',
    //         offsetY: -15,
    //         style: {
    //           color: '#fff',
    //           background: '#00e396',
    //           padding: {
    //             left: 10,
    //             right: 10,
    //             top: 10,
    //             bottom: 5
    //           },
    //           borderRadius: 5,
    //           fontSize: '12px',
    //           fontWeight: 'bold'
    //         },
    //         text: 'Low Peak'
    //       }
    //     }
    //   ]
    // },
  };

  const chartSeries = [
    {
      name: "Orders",
      data: orderData
    }
  ];

  // Date range handlers
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === 'Custom Range');
    if (range !== 'Custom Range') {
      setStartDate(null);
      setEndDate(null);
      fetchWeeklyOrderStats(range);
    }
  };

  const handleReload = () => {
    // Set user interaction flag to true
    setUserInteracted(true);
    
    // Check if we have valid startDate and endDate (indicating custom range)
    if (startDate && endDate) {
      console.log('Reloading with custom date range:', formatDate(startDate), 'to', formatDate(endDate));
      // For custom range, explicitly use 'Custom Range'
      fetchWeeklyOrderStats('Custom Range', true);
    } else {
      // For other ranges, use the current dateRange state
      console.log('Reloading with standard date range:', dateRange);
      fetchWeeklyOrderStats(dateRange, true);
    }
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchWeeklyOrderStats('Custom Range');
    }
  };

  // Handle GIF animation
  useEffect(() => {
    if (isGifPlaying) {
      const timer = setTimeout(() => {
        setIsGifPlaying(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isGifPlaying]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Weekly Order Statistics</h5>
      </div>

      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-6">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <span className="badge bg-danger p-2">
                  <i className="fas fa-arrow-up"></i>
                </span>
              </div>
              <div>
                <p className="mb-0">Peak Day</p>
                <h6 className="mb-0">{peakDay} - {maxOrders} orders</h6>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <span className="badge bg-success p-2">
                  <i className="fas fa-arrow-down"></i>
                </span>
              </div>
              <div>
                <p className="mb-0">Low Peak Day</p>
                <h6 className="mb-0">{lowPeakDay} - {minOrders} orders</h6>
              </div>
            </div>
          </div>
        </div>
        
        <div id="weeklyOrderChart">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '450px' }}>
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
                <ReactApexChart 
                  options={chartOptions} 
                  series={chartSeries} 
                  type="bar" 
                  height={450}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyOrderStat;