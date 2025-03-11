import React, { useState } from 'react';


function TopSell() {
  const [selectedTab, setSelectedTab] = useState('top');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Products</h5>
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control"
            value={selectedDate.split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-outline-primary">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      
      <div className="d-flex border-bottom mb-2">
        <span
          className={`me-3 pb-2 ${selectedTab === 'top' ? 'border-bottom border-danger' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedTab('top')}
        >
          Top Selling
        </span>
        <span
          className={`pb-2 ${selectedTab === 'low' ? 'border-bottom border-danger' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedTab('low')}
        >
          Low Selling
        </span>
      </div>

      <div>
        {(selectedTab === 'top' ? topSellingProducts : lowSellingProducts).length > 0 ? (
          <ul className="list-group">
            {(selectedTab === 'top' ? topSellingProducts : lowSellingProducts).map((product) => (
              <li key={product.id} className="list-group-item d-flex justify-content-between">
                <span>{product.name}</span>
                <span>{product.quantity} Sold</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted">There Are No Items Available</div>
        )}
      </div>

    </div>
  );
}

export default TopSell;
