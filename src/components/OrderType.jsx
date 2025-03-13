import React, { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';

const orderTypes = [
   
  

  { 
    name: "Dine In", 
    icon: "fas fa-utensils",
    count: 156,
    // trend: "+12.5%",
    // trendUp: true,
    color: "primary"
  },
  { 
    name: "Drive Through", 
    icon: "fas fa-car",
    count: 89,
     // trend: "+8.2%",
    // trendUp: true,
    color: "info"
  },
  { 
    name: "Parcel", 
    icon: "fas fa-box",
    count: 124,
    // trend: "-3.1%",
    // trendUp: false,
    color: "success"
  },
  { 
    name: "Delivery", 
    icon: "fas fa-globe",
    count: 245,
    //  trend: "+15.7%",
    // trendUp: true,
    color: "warning"
  },
  
];

const OrderType = () => {
  const [dateRange, setDateRange] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isGifPlaying, setIsGifPlaying] = useState(false);

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
            className={`btn btn-icon p-0 ${loading ? 'disabled' : ''}`}
            onClick={handleReload}
            disabled={loading}
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
                position: 'relative'
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


      <div className="card-body">
        <div className="row g-3">
          {orderTypes.map((order, index) => (
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
                    <small className={`${order.trendUp ? 'text-success' : 'text-danger'} fw-semibold`}>
                      {/* <i className={`fas fa-arrow-${order.trendUp ? 'up' : 'down'}`}></i> */}
                      {order.trend}
                    </small>
                  </div>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderType;
