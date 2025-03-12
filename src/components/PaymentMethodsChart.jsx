import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaymentMethodsChart = () => {
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

  const data = [
    { method: 'Cash', value: Math.floor(Math.random() * 2000) },
    { method: 'Card', value: Math.floor(Math.random() * 2000) },
    { method: 'Wallet', value: Math.floor(Math.random() * 2000) },
    { method: 'Due Payment', value: Math.floor(Math.random() * 2000) },
    { method: 'Other', value: Math.floor(Math.random() * 2000) },
    { method: 'Online Paid', value: Math.floor(Math.random() * 2000) },
    { method: 'Online COD', value: Math.floor(Math.random() * 2000) }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Total Sales</h5>
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
            <h6 className="mb-0">Total: ₹{total}</h6>
          </div>
        </div>
        <div className="payment-methods-chart">
          {data.map((item, index) => (
            <div key={index} className="d-flex align-items-center mb-3 payment-row">
              <div className="payment-method" style={{ width: '120px', color: '#433c50' }}>
                {item.method}
              </div>
              <div className="flex-grow-1 px-3">
                <div className="progress" style={{ height: '8px', backgroundColor: '#f4f5fa' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ 
                      width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                      backgroundColor: '#8c57ff',
                      borderRadius: '4px'
                    }} 
                    aria-valuenow={item.value} 
                    aria-valuemin="0" 
                    aria-valuemax={Math.max(...data.map(d => d.value))}
                  ></div>
                </div>
              </div>
              <div className="payment-amount" style={{ width: '80px', textAlign: 'right', color: '#433c50' }}>
                ₹{item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsChart; 