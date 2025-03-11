import React, { useState } from 'react'

const OrderStat = () => {
    const [dateRange, setDateRange] = useState('7th Mar');
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
        { title: 'Success Order', value: '34', subtitle: 'Success Order' },
        { title: 'Cancelled Order', value: '55', subtitle: 'Cancelled Order' },
        { title: 'Complimentary Order', value: '12', subtitle: 'Complimentary Order' },
        { title: 'Table Turn Around Time', value: '10 min', subtitle: 'Table Turn Around Time' }
    ];

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Order Statistics</h5>
        <div className="d-flex align-items-center gap-2">
          <div className="dropdown">
            <button 
              type="button" 
              className="btn btn-outline-primary dropdown-toggle"
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              {dateRange}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a href="#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); handleDateRangeChange('7th Mar'); }}>7th Mar</a>
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
            <div key={index} className="col-md-6">
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
  )
}

export default OrderStat