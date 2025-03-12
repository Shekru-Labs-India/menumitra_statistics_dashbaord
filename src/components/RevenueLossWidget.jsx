import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RevenueLossWidget = () => {
  const [dateRange, setDateRange] = useState('Yesterday');
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

  const metrics = [
    { title: 'Bills Modified', value: '12', subtitle: 'Bills Modified' },
    { title: 'Bills Re-Printed', value: '23', subtitle: 'Bills Re-Printed' },
    { title: 'Waived Off', value: '₹16', subtitle: 'Waived Off' },
    { title: 'KOTs Cancelled', value: '6', subtitle: 'KOTs Cancelled' },
    { title: 'Modified KOTs', value: '33', subtitle: 'Modified KOTs' },
    { title: 'Not Used In Bills', value: '23', subtitle: 'Not Used In Bills' }
  ];

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Revenue Leakage</h5>
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
        <div className="row g-4">
          {metrics.map((metric, index) => (
            <div key={index} className="col-md-4">
              <div className="d-flex flex-column p-3 bg-label-primary rounded">
                <div className="text-heading mb-2">
                  {metric.title}
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded me-2" style={{ width: '4px', height: '40px' }}></div>
                  <div>
                    <h4 className="mb-0 text-heading fw-medium fs-4">
                      {metric.value}
                    </h4>
                    <small className="text-muted">
                      {metric.subtitle}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueLossWidget; 