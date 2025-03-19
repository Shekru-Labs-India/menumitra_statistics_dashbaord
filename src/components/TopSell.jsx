import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
// Import both GIFs - static and animated
import aiAnimationGif from "../assets/img/gif/AI-animation-unscreen.gif";
import aiAnimationStillFrame from "../assets/img/gif/AI-animation-unscreen-still-frame.gif";

function TopSell() {
  const [selectedTab, setSelectedTab] = useState("top");
  const [dateRange, setDateRange] = useState("Today");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [salesData, setSalesData] = useState({
    top_selling: [],
    low_selling: []
  });
  const [error, setError] = useState(null);

  // API endpoint
  const apiEndpoint = "https://men4u.xyz/";

  // Helper function to get auth headers
  const getAuthHeaders = (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Only add Authorization header if includeAuth is true and token exists
    if (includeAuth) {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    
    return headers;
  };

  // Function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        console.error('Unauthorized access');
        // You may want to redirect to login page here
      }
      
      return error.response.data?.message || 'An error occurred. Please try again.';
    } else if (error.request) {
      return 'No response from server. Please check your internet connection.';
    } else {
      return 'Error setting up request. Please try again.';
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData(dateRange);
  }, []);

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
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const day = date.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDateRangeForAPI = (range) => {
    let start, end;
    const today = new Date();
    
    switch (range) {
      case "Today":
        start = new Date();
        end = new Date();
        break;
      case "Yesterday":
        start = new Date();
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      case "Last 7 Days":
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - 6);
        break;
      case "Last 30 Days":
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - 29);
        break;
      case "Current Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case "Last Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Custom Range":
        start = startDate;
        end = endDate;
        break;
      default:
        start = new Date();
        end = new Date();
    }
    
    return { start, end };
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === "Custom Range");
    if (range !== "Custom Range") {
      fetchData(range);
    }
  };

  const handleReload = () => {
    setLoading(true);
    fetchData(dateRange);
  };

  const fetchData = async (range) => {
    setLoading(true);
    setError(null);
    
    try {
      // Skip API call if custom range but dates not selected
      if (range === "Custom Range" && (!startDate || !endDate)) {
        setLoading(false);
        return;
      }
      
      // Get outlet ID from localStorage
      const outletId = localStorage.getItem('outlet_id');
      
      if (!outletId) {
        console.error('No outlet ID found in localStorage');
        setError('No outlet ID found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const { start, end } = getDateRangeForAPI(range);
      
      const requestData = {
        outlet_id: outletId,
        start_date: formatDateForAPI(start),
        end_date: formatDateForAPI(end)
      };
      
      console.log('Sending request to sales_performance with data:', requestData);
      
      const response = await axios.post(
        `${apiEndpoint}outlet_statistics/sales_performance`, 
        requestData, 
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('API Response:', response.data);
      
      if (response.data) {
        setSalesData({
          top_selling: response.data.top_selling || [],
          low_selling: response.data.low_selling || []
        });
      }
    } catch (err) {
      console.error("Error fetching sales performance data:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage || "Failed to load sales data. Please try again.");
      // Fall back to empty data
      setSalesData({
        top_selling: [],
        low_selling: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchData("Custom Range");
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
        <h5 className="card-title mb-0">Products Analysis</h5>
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
                  onClick={() => handleDateRangeChange("Custom Range")}
                >
                  Custom Range
                </a>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={`btn btn-icon p-0 ${loading ? "disabled" : ""}`}
            onClick={handleReload}
            disabled={loading}
            style={{ border: "1px solid var(--bs-primary)" }}
          >
            <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}></i>
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
              border: "1px solid #e9ecef",
            }}
            onClick={() => setIsGifPlaying(true)}
            title={
              isGifPlaying ? "Animation playing" : "Click to play animation"
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
                  objectFit: "contain",
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
                  opacity: 0.9,
                }}
              />
            )}
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

      <div className="card-body">
        <div className="nav nav-tabs mb-3">
          <button
            className={`nav-link ${selectedTab === 'top' ? 'active' : ''}`}
            onClick={() => setSelectedTab('top')}
            style={{
              fontWeight: selectedTab === 'top' ? 'bold' : 'normal',
              borderRadius: '8px',
              backgroundColor: selectedTab === 'top' ? 'var(--bs-primary)' : 'transparent',
              color: selectedTab === 'top' ? 'var(--bs-white)' : ''
            }}
          >
            Top Selling
          </button>
          <button
            className={`nav-link ${selectedTab === 'low' ? 'active' : ''}`}
            onClick={() => setSelectedTab('low')}
            style={{
              fontWeight: selectedTab === 'low' ? 'bold' : 'normal',
              borderRadius: '8px',
              backgroundColor: selectedTab === 'low' ? 'var(--bs-primary)' : 'transparent',
              color: selectedTab === 'low' ? 'var(--bs-white)' : ''
            }}
          >
            Low Selling
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            {salesData[selectedTab === "top" ? "top_selling" : "low_selling"].length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Sales Count</th>
                      <th>Total Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData[selectedTab === "top" ? "top_selling" : "low_selling"].map((product) => (
                      <tr key={product.item_id}>
                        <td>{product.name}</td>
                        <td>{product.sales_count}</td>
                        <td>{product.total_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted p-3">
                {loading ? "Loading..." : "No products data available for the selected period"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopSell;
