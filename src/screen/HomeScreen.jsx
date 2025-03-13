import React, { useState, useEffect } from "react";
import axios from 'axios';
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
import Footer from "../components/Footer";
// Import both GIFs - static and animated
import aiAnimationGif from '../assets/img/gif/AI-animation-unscreen.gif';
import aiAnimationStillFrame from '../assets/img/gif/AI-animation-unscreen-still-frame.gif';
import { apiEndpoint } from '../config/menuMitraConfig';

function HomeScreen() {
  const [dateRange, setDateRange] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    total_orders: 0,
    average_order_value: 0,
    customer_count: 0,
    total_revenue: 0,
    average_turnover_time: "00:00 - 00:00"
  });
  
  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Add request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const outletId = localStorage.getItem('outlet_id');
      if (outletId) {
        if (config.method === 'get' && config.params) {
          config.params = { ...config.params, outlet_id: outletId };
        } else if (config.method === 'post' && config.data) {
          config.data = { ...config.data, outlet_id: outletId };
        } else {
          config.params = { outlet_id: outletId };
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.error('Unauthorized access');
            // Handle unauthorized access (e.g., redirect to login)
            break;
          case 403:
            console.error('Forbidden access');
            break;
          case 404:
            console.error('Resource not found');
            break;
          default:
            console.error('Server error:', error.response.data);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      return Promise.reject(error);
    }
  );

  // Simplified effect to handle the animation timing
  useEffect(() => {
    if (isGifPlaying) {
      // Set a timeout to stop playing after 3 seconds
      const timer = setTimeout(() => {
        setIsGifPlaying(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isGifPlaying]);

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const outletId = localStorage.getItem('outlet_id');
    if (!outletId) {
      console.error('No outlet ID found in localStorage');
      return;
    }
    fetchStatistics(dateRange);
  }, []);

  const fetchStatistics = async (range) => {
    try {
      setLoading(true);
      setError('');
      
      let requestData = {};
      if (range === 'Custom Range' && startDate && endDate) {
        requestData = {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        };
      } else if (range !== 'Custom Range') {
        requestData = { date_range: range };
      }

      // Use POST method instead of GET
      const response = await axiosInstance.post('analytics_reports', requestData);
      
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError(error.response?.data?.message || 'Failed to fetch statistics. Please try again.');
      // Reset statistics on error
      setStatistics({
        total_orders: 0,
        average_order_value: 0,
        customer_count: 0,
        total_revenue: 0,
        average_turnover_time: "00:00 - 00:00"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === 'Custom Range');
    if (range !== 'Custom Range') {
      fetchStatistics(range);
    }
  };

  const handleReload = () => {
    fetchStatistics(dateRange);
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchStatistics('Custom Range');
    }
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          <div className="content-wrapper flex-grow-1">
            <div className="container-xxl flex-grow-1 container-p-y">
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              {/* Welcome Card Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-md-center align-items-start p-4">
                      <h5 className="card-title mb-0">
                        Welcome to MenuMitra Owner Dashboard
                      </h5>
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
                            {[
                              "Today",
                              "Yesterday",
                              "Last 7 Days",
                              "Last 30 Days",
                              "Current Month",
                              "Last Month",
                            ].map((range) => (
                              <li key={range}>
                                <a
                                  href="javascript:void(0);"
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleDateRangeChange(range)}
                                >
                                  {range}
                                </a>
                              </li>
                            ))}
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item d-flex align-items-center"
                                onClick={() =>
                                  handleDateRangeChange("Custom Range")
                                }
                              >
                                Custom Range
                              </a>
                            </li>
                          </ul>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-icon p-0 ${
                            loading ? "disabled" : ""
                          }`}
                          onClick={handleReload}
                          disabled={loading}
                          style={{ border: '1px solid var(--bs-primary)' }}
                        >
                          <i
                            className={`fas fa-sync-alt ${
                              loading ? "fa-spin" : ""
                            }`}
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm p-0"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            position: "relative",
                            border: '1px solid #e9ecef'
                          }}
                          onClick={() => setIsGifPlaying(true)}
                          title={
                            isGifPlaying
                              ? "Animation playing"
                              : "Click to play animation"
                          }
                        >
                          {/* Using two separate images - static frame and animated */}
                          {isGifPlaying ? (
                            // Show animated GIF when playing
                            <img
                              src={aiAnimationGif}
                              alt="AI Animation (Playing)"
                              style={{
                                width: "24px",
                                height: "24px",
                                objectFit: "contain"
                              }}
                            />
                          ) : (
                            // Show static frame when not playing
                            <img
                              src={aiAnimationStillFrame}
                              alt="AI Animation (Click to play)"
                              style={{
                                width: "24px",
                                height: "24px",
                                objectFit: "contain",
                                opacity: 0.9
                              }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {showDatePicker && (
                      <div className="card-body px-4 py-3">
                        <div className="d-flex flex-column gap-2">
                          <label>Select Date Range:</label>
                          <div className="d-flex gap-2 flex-wrap">
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
                          <button
                            className="btn btn-primary mt-2"
                            onClick={handleCustomDateSelect}
                            disabled={!startDate || !endDate}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="card-body p-4">
                      <p className="mb-4">
                        Select an outlet from the search menu above to view
                        detailed analytics and reports.
                      </p>
                      {/* Stats Cards */}
                      <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">
                                    Totals Orders
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">{statistics.total_orders}</h4>
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
                                  <span className="fw-medium d-block mb-1">
                                    Total Revenue
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹{statistics.total_revenue}</h4>
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
                                  <span className="fw-medium d-block mb-1">
                                    Customers count
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">{statistics.customer_count}</h4>
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
                                  <span className="fw-medium d-block mb-1">
                                    Average Order Value
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹{statistics.average_order_value.toFixed(2)}</h4>
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
                                  <span className="fw-medium d-block mb-1">
                                    Table Turnover
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">{statistics.average_turnover_time}</h4>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <PaymentMethodsChart />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <RevenueLossWidget />
                  </div>
                </div>
              </div>

              {/* Sales Section */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <TopSell />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <OrderStat />
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <FoodTypeGraph />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="h-100">
                    <OrderType />
                  </div>
                </div>
                <div className="row mt-4">
                  <OrderAnalytics />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
