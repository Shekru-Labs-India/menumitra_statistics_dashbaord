import React, { useState } from "react";
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import PaymentMethodsChart from "../components/PaymentMethodsChart";
import RevenueLossWidget from "../components/RevenueLossWidget";
import TopSell from "../components/TopSell";
import OrderStat from "../components/OrderStat";
import FoodTypeGraph from "../components/FoodTypeGraph";

function HomeScreen() {
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

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page">
          <Header />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
                      <h5 className="card-title mb-0">Welcome to MenuMitra Owner Dashboard</h5>
                      <div className="d-flex align-items-center gap-3">
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
                      <p className="mb-4">
                        Select an outlet from the search menu above to view detailed analytics and reports.
                      </p>
                      <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Orders</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">234</h4>
                                    <span className="text-success">(+32%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <i className="fas fa-shopping-cart"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Revenue</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹47600</h4>
                                    <span className="text-success">(+45%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-success">
                                    <i className="fas fa-rupee-sign"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Customers</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">123</h4>
                                    <span className="text-success">(+13%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-warning">
                                    <i className="fas fa-users"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Average Order Value</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹1450</h4>
                                    <span className="text-success">(+10%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-info">
                                    <i className="fas fa-chart-line"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Table Turnover</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">10 min</h4>
                                    <span className="text-success">(+10%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-danger">
                                    <i className="fas fa-chair"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Peak Hours</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">10:00 AM - 11:00 AM</h4>
                                    <span className="text-success">(+10%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-secondary">
                                    <i className="fas fa-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Popular Items</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">Pizza</h4>
                                    <span className="text-success">(+10%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <i className="fas fa-utensils"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Customer Satisfaction</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">95%</h4>
                                    <span className="text-success">(+10%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-success">
                                    <i className="fas fa-smile"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods Chart and Revenue Loss Widget */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <PaymentMethodsChart />
                </div>
                <div className="col-md-6">
                  <RevenueLossWidget />
                </div>
                <div className="row mt-4">
                <div className="col-md-6">
                  <TopSell />
                </div>
                <div className="col-md-6">
                  <OrderStat />
                </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <FoodTypeGraph />
                  </div>
                </div>
                
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
