import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import PaymentMethodsChart from "../components/PaymentMethodsChart";
import RevenueLossWidget from "../components/RevenueLossWidget";
import TopSell from "../components/TopSell";
import OrderStat from "../components/OrderStat";
import FoodTypeGraph from "../components/FoodTypeGraph";
import OrderType from "../components/OrderType";
import OrderAnalytics from '../components/OrderAnalytics';

function HomeScreen() {
  const [dateRange, setDateRange] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        setDateRange(`${startDate.toDateString()} - ${endDate.toDateString()}`);
        setShowDatePicker(false);
        fetchData('Custom Range');
    }
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
                                placeholderText="From"
                                className="form-control"
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
                            />
                        </div>
                        <button className="btn btn-primary mt-2" onClick={handleCustomDateSelect} disabled={!startDate || !endDate}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
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
                                    <h4 className="mb-0 me-2">₹145</h4>
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
                                    <h4 className="mb-0 me-2">10:00 AM - 11:00 PM</h4>
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
                  <div className="col-md-6">
                    <OrderType />
                  </div>
                </div>
                <div className="row mt-4">
                  <OrderAnalytics />
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
