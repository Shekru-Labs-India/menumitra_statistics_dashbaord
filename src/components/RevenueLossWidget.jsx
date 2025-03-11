import React, { useState } from 'react';

const RevenueLossWidget = () => {
  const [dateRange, setDateRange] = useState('Yesterday');
  const [loading, setLoading] = useState(false);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    fetchData(range);
  };

  const handleReload = () => {
    setLoading(true);
    fetchData(dateRange);
    setTimeout(() => setLoading(false), 1000);
  };

  const fetchData = (range) => {
    console.log('Fetching data for range:', range);
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
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Today'); }}>Today</a>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Yesterday'); }}>Yesterday</a>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Last 7 Days'); }}>Last 7 Days</a>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Last 30 Days'); }}>Last 30 Days</a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Current Month'); }}>Current Month</a>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('Last Month'); }}>Last Month</a>
              </li>
            </ul>
          </div>
          <button 
            type="button" 
            className={`btn btn-icon btn-outline-primary ${loading ? 'disabled' : ''}`}
            onClick={handleReload}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          </button>
        </div>
      </div>
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