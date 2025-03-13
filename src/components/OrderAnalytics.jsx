import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OrderAnalytics = () => {
  const [dateRange, setDateRange] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  return (
    <div className="col-12 col-md-6 col-lg-6 order-0 order-sm-4 order-xxl-0">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
          <h5 className="card-title mb-0 text-nowrap">Order Analytics</h5>
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
          </div>
        </div>

        {showDatePicker && (
          <div className="card-body">
            <div className="d-flex flex-column gap-2">
              <label>Select Date Range:</label>
              <div className="d-flex flex-column flex-md-row gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  placeholderText="From"
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
                  placeholderText="To"
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
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-4 pt-1">
                <div className="icon-bg bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="ri-time-line ri-lg text-white"></i>
                </div>
                <div className="ms-4 d-flex flex-column">
                  <h5 className="mb-0">Avg First Order Time</h5>
                  <p className="mb-0">{Math.floor(Math.random() * 100)} mins</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-bg bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="ri-timer-line ri-lg text-white"></i>
                </div>
                <div className="ms-4 d-flex flex-column">
                  <h5 className="mb-0">Avg Last Order Time</h5>
                  <p className="mb-0">{Math.floor(Math.random() * 100)} mins</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center mb-4 mb-md-0">
                <div className="icon-bg bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="ri-dashboard-line ri-lg text-white"></i>
                </div>
                <div className="ms-4 d-flex flex-column">
                  <h5 className="mb-0">Avg Order Time</h5>
                  <p className="mb-0">{Math.floor(Math.random() * 100)} mins</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="icon-bg bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="ri-restaurant-line ri-lg text-white"></i>
                </div>
                <div className="ms-4 d-flex flex-column">
                  <h5 className="mb-0">Avg Cooking Time</h5>
                  <p className="mb-0">{Math.floor(Math.random() * 100)} mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics; 