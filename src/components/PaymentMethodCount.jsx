import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiEndpoint } from '../config/menuMitraConfig'

const PaymentMethodCount = () => {
  const [paymentCounts, setPaymentCounts] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    complimentary: 0
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('Today');
  
  useEffect(() => {
    // In a real implementation, fetch payment method counts
    // Example mock data for now
    setPaymentCounts({
      cash: 156,
      upi: 243,
      card: 87,
      complimentary: 12
    });
  }, []);

  // Calculate total count
  const totalCount = Object.values(paymentCounts).reduce((a, b) => a + b, 0);
  
  // Calculate max count for scaling
  const maxCount = Math.max(...Object.values(paymentCounts));

  // Calculate percentage width for progress bars
  const getPercentage = (count) => {
    return (count / maxCount) * 100;
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Total Payment counts</h5>
        <div className="dropdown">
          <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-calendar me-2"></i>
            {dateRange}
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => setDateRange('Today')}>Today</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setDateRange('Yesterday')}>Yesterday</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setDateRange('Last 7 Days')}>Last 7 Days</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setDateRange('This Month')}>This Month</a></li>
          </ul>
        </div>
      </div>
      <div className="card-body">
        <h4 className="mb-4">Total: {totalCount}</h4>
        
        <div className="payment-methods-list">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Cash</span>
              <span>{paymentCounts.cash}</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${getPercentage(paymentCounts.cash)}%` }} 
                aria-valuenow={paymentCounts.cash} 
                aria-valuemin="0" 
                aria-valuemax={maxCount}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Card</span>
              <span>{paymentCounts.card}</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-info" 
                role="progressbar" 
                style={{ width: `${getPercentage(paymentCounts.card)}%` }} 
                aria-valuenow={paymentCounts.card} 
                aria-valuemin="0" 
                aria-valuemax={maxCount}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>UPI</span>
              <span>{paymentCounts.upi}</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${getPercentage(paymentCounts.upi)}%` }} 
                aria-valuenow={paymentCounts.upi} 
                aria-valuemin="0" 
                aria-valuemax={maxCount}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Complimentary</span>
              <span>{paymentCounts.complimentary}</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-warning" 
                role="progressbar" 
                style={{ width: `${getPercentage(paymentCounts.complimentary)}%` }} 
                aria-valuenow={paymentCounts.complimentary} 
                aria-valuemin="0" 
                aria-valuemax={maxCount}
              ></div>
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
  )
}

export default PaymentMethodCount