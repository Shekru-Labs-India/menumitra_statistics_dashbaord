import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';

const WeeklyOrderStat = () => {
  const [dateRange, setDateRange] = useState('This Week');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);

  // Generate mock data for the hours between 6 AM to 11:59 PM
  const generateHourlyData = () => {
    const hours = [];
    const orderCounts = [];
    
    // Generate data for 6 AM to 11:59 PM
    for (let i = 6; i <= 23; i++) {
      const amPm = i < 12 ? 'AM' : 'PM';
      const hourDisplay = i > 12 ? i - 12 : i;
      hours.push(`${hourDisplay}:00 ${amPm}`);
      
      // Random order count with different peaks throughout the day
      let count;
      if (i >= 8 && i <= 9) {
        // Morning peak (breakfast)
        count = Math.floor(Math.random() * 30) + 40; // 40-70 orders
      } else if (i >= 12 && i <= 14) {
        // Lunch peak
        count = Math.floor(Math.random() * 35) + 55; // 55-90 orders
      } else if (i >= 19 && i <= 21) {
        // Dinner peak
        count = Math.floor(Math.random() * 40) + 60; // 60-100 orders
      } else if (i >= 10 && i <= 11 || i >= 15 && i <= 18) {
        // Medium time
        count = Math.floor(Math.random() * 25) + 25; // 25-50 orders
      } else {
        // Low peak time
        count = Math.floor(Math.random() * 15) + 10; // 10-25 orders
      }
      
      orderCounts.push(count);
    }
    
    return { hours, orderCounts };
  };

  const { hours, orderCounts } = generateHourlyData();
  
  // Find peak and low peak times
  const maxOrders = Math.max(...orderCounts);
  const minOrders = Math.min(...orderCounts);
  const peakTimeIndex = orderCounts.indexOf(maxOrders);
  const lowPeakTimeIndex = orderCounts.indexOf(minOrders);
  const peakTime = hours[peakTimeIndex];
  const lowPeakTime = hours[lowPeakTimeIndex];

  // ApexCharts options
  const chartOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#8c57ff'],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + ' orders';
      },
      style: {
        fontSize: '10px',
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 6,
      colors: ['#8c57ff'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    xaxis: {
      categories: hours,
      title: {
        text: 'Hour of Day'
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '10px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Order Count'
      },
      min: 0,
      max: Math.ceil(maxOrders * 1.2), // 20% headroom
    },
    annotations: {
      points: [
        {
          x: peakTime,
          y: maxOrders,
          marker: {
            size: 8,
            fillColor: '#FF4560',
            strokeColor: '#fff',
            radius: 2
          },
          label: {
            borderColor: '#FF4560',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#FF4560',
            },
            text: 'Peak Time'
          }
        },
        {
          x: lowPeakTime,
          y: minOrders,
          marker: {
            size: 8,
            fillColor: '#00E396',
            strokeColor: '#fff',
            radius: 2
          },
          label: {
            borderColor: '#00E396',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#00E396',
            },
            text: 'Low Peak'
          }
        }
      ]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " orders";
        }
      }
    },
    title: {
      text: 'Hourly Order Distribution (6 AM - 11:59 PM)',
      align: 'left',
      style: {
        fontSize: '14px'
      }
    }
  };

  const chartSeries = [
    {
      name: "Orders",
      data: orderCounts
    }
  ];

  // Date range handlers
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
    setTimeout(() => setLoading(false), 1000);
  };

  const fetchData = (range) => {
    if (range === 'Custom Range' && startDate && endDate) {
      console.log('Fetching data for custom range:', startDate, endDate);
    } else {
      console.log('Fetching data for range:', range);
    }
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchData('Custom Range');
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
              {['This Week', 'Last Week', 'Last 2 Weeks', 'Last 30 Days'].map((range) => (
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

      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <div className="d-flex align-items-center mb-1">
              <div className="me-3">
                <span className="badge bg-danger p-2">
                  <i className="fas fa-arrow-up"></i>
                </span>
              </div>
              <div>
                <p className="mb-0">Peak Time</p>
                <h6 className="mb-0">{peakTime} - {maxOrders} orders</h6>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <span className="badge bg-success p-2">
                  <i className="fas fa-arrow-down"></i>
                </span>
              </div>
              <div>
                <p className="mb-0">Low Peak Time</p>
                <h6 className="mb-0">{lowPeakTime} - {minOrders} orders</h6>
              </div>
            </div>
          </div>
        </div>
        
        <div id="weeklyOrderChart">
          <ReactApexChart 
            options={chartOptions} 
            series={chartSeries} 
            type="line" 
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyOrderStat;