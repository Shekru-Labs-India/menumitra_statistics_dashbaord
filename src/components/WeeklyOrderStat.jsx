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

  // Generate mock data for Monday to Sunday
  const generateWeeklyData = () => {
    // Order days from Monday to Sunday
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const orderCounts = [];
    
    // Generate data between 0-1000
    orderCounts.push(780); // Monday
    orderCounts.push(850); // Tuesday
    orderCounts.push(600); // Wednesday
    orderCounts.push(820); // Thursday
    orderCounts.push(750); // Friday
    orderCounts.push(920); // Saturday
    orderCounts.push(680); // Sunday
    
    return { days, orderCounts };
  };

  const { days, orderCounts } = generateWeeklyData();
  
  // Find peak and low peak days
  const maxOrders = Math.max(...orderCounts);
  const minOrders = Math.min(...orderCounts);
  const peakDayIndex = orderCounts.indexOf(maxOrders);
  const lowPeakDayIndex = orderCounts.indexOf(minOrders);
  const peakDay = days[peakDayIndex];
  const lowPeakDay = days[lowPeakDayIndex];

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
      height: 300,
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
      background: 'transparent'
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
        columnWidth: '70%',
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
        bottom: 15,
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
        rotate: 0,
        offsetY: 5
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
      max: 1000,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          colors: '#5a5a5a'
        },
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    legend: {
      show: true,
      position: 'right',
      fontSize: '12px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      offsetY: 0,
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
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
    annotations: {
      points: [
        {
          x: peakDay,
          y: maxOrders,
          marker: {
            size: 10,
            fillColor: '#fff',
            strokeColor: '#ff4560',
            strokeWidth: 2,
            radius: 20
          },
          label: {
            borderColor: '#ff4560',
            offsetY: -15,
            style: {
              color: '#fff',
              background: '#ff4560',
              padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
              },
              borderRadius: 5,
              fontSize: '12px',
              fontWeight: 'bold'
            },
            text: 'Peak Day'
          }
        },
        {
          x: lowPeakDay,
          y: minOrders,
          marker: {
            size: 10,
            fillColor: '#fff',
            strokeColor: '#00e396',
            strokeWidth: 2,
            radius: 20
          },
          label: {
            borderColor: '#00e396',
            offsetY: -15,
            style: {
              color: '#fff',
              background: '#00e396',
              padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
              },
              borderRadius: 5,
              fontSize: '12px',
              fontWeight: 'bold'
            },
            text: 'Low Peak'
          }
        }
      ]
    },
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
          <ReactApexChart 
            options={chartOptions} 
            series={chartSeries} 
            type="bar" 
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyOrderStat;