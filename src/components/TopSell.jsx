import React, { useState } from 'react';

function TopSell() {
  const [selectedTab, setSelectedTab] = useState('top');
  const [dateRange, setDateRange] = useState('Today');
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

  const topSellingProducts = [
    { id: 1, name: 'Butter Chicken', quantity: 350, revenue: '₹15,000' },
    { id: 2, name: 'Paneer Tikka', quantity: 190, revenue: '₹12,000' },
    { id: 3, name: 'Dal Makhani', quantity: 160, revenue: '₹8,000' },
    { id: 4, name: 'Naan', quantity: 200, revenue: '₹4,000' },
    { id: 5, name: 'Biryani', quantity: 90, revenue: '₹9,000' },
  ];

  const lowSellingProducts = [
    { id: 1, name: 'Kheer', quantity: 20, revenue: '₹2,000' },
    { id: 2, name: 'Rasmalai', quantity: 15, revenue: '₹1,500' },
    { id: 3, name: 'Gulab Jamun', quantity: 25, revenue: '₹2,500' },
    { id: 4, name: 'Ice Cream', quantity: 30, revenue: '₹3,000' },
    { id: 5, name: 'Faluda', quantity: 18, revenue: '₹1,800' },
  ];

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Products Analysis</h5>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">{dateRange}</span>
          <div className="dropdown">
            <button 
              type="button" 
              className="btn dropdown-toggle p-0"
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <i className="ri-calendar-2-line"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Today')}>
                    Today
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Yesterday')}>
                    Yesterday
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Last 7 Days')}>
                    Last 7 Days
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Last 30 Days')}>
                    Last 30 Days
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Current Month')}>
                    Current Month
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" 
                   className="dropdown-item d-flex align-items-center"
                   onClick={() => handleDateRangeChange('Last Month')}>
                    Last Month
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
      
      <div className="card-body">
        <div className="nav nav-tabs mb-3">
          <button
            className={`nav-link ${selectedTab === 'top' ? 'active' : ''}`}
            onClick={() => setSelectedTab('top')}
          >
            Top Selling
          </button>
          <button
            className={`nav-link ${selectedTab === 'low' ? 'active' : ''}`}
            onClick={() => setSelectedTab('low')}
          >
            Low Selling
          </button>
        </div>

        <div className="tab-content">
          {(selectedTab === 'top' ? topSellingProducts : lowSellingProducts).length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedTab === 'top' ? topSellingProducts : lowSellingProducts).map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted p-3">There Are No Items Available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopSell;
