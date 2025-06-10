import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
// Import both GIFs - static and animated
import aiAnimationGif from "../assets/img/gif/AI-animation-unscreen.gif";
import aiAnimationStillFrame from "../assets/img/gif/AI-animation-unscreen-still-frame.gif";
import { useDashboard } from "../context/DashboardContext"; // Import context
import { apiEndpoint } from '../config/menuMitraConfig';

function TopSell() {
  // Get data from context
  const { 
    salesPerformance_from_context,
    loading: contextLoading,
    error: contextError
  } = useDashboard();

  // State management 
  const [selectedTab, setSelectedTab] = useState("top");
  const [dateRange, setDateRange] = useState("All Time");
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
  const [userInteracted, setUserInteracted] = useState(false); // Flag to track user interaction
  const [isReloading, setIsReloading] = useState(false); // Add new state for reload action

  // Use context data when component mounts
  useEffect(() => {
    if (salesPerformance_from_context) {
      setSalesData({
        top_selling: salesPerformance_from_context.top_selling || [],
        low_selling: salesPerformance_from_context.low_selling || []
      });
    }
  }, [salesPerformance_from_context]);

  // Set error from context if available
  useEffect(() => {
    if (contextError && !userInteracted) {
      setError(contextError);
    }
  }, [contextError, userInteracted]);

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

  // Format date for display (e.g., "01 Jan 2023")
  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}`;
  };

  // Get date range parameters based on selected option
  const getDateRange = (range) => {
    const today = new Date();
    let start, end;
    
    switch (range) {
      case "Today":
        start = end = new Date();
        break;
      case "Yesterday":
        start = end = new Date();
        start.setDate(start.getDate() - 1);
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
      default: // All Time
        return null;
    }
    
    return { 
      start_date: formatDate(start),
      end_date: formatDate(end)
    };
  };

  // Get the current data to display based on selected tab
  const getCurrentData = () => {
    // Only return the exact API data for the selected tab
    return selectedTab === "top" ? salesData.top_selling : salesData.low_selling;
  };

  // Modify renderDataTable to show only API data
  const renderDataTable = () => {
    const data = getCurrentData();
    
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-muted p-3">
          No products data available for the selected period
        </div>
      );
    }
    
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Menu Name</th>
              <th>Sales Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr key={`${product.item_id}-${index}`}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.sales_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Modify fetchData to store exact API response
  const fetchData = async (range, isReloadAction = false) => {
    if (!isReloadAction) {
      setLoading(true);
    }
    setError(null);
    setUserInteracted(true);
    
    try {
      const outletId = localStorage.getItem('outlet_id');
      if (!outletId) {
        setError('No outlet ID found. Please log in again.');
        return;
      }
      
      const requestData = { 
        outlet_id: outletId,
        device_token: localStorage.getItem('device_token') || '',
        device_id: localStorage.getItem('device_id') || ''
      };
      
      const dateParams = getDateRange(range);
      if (dateParams && (range !== "Custom Range" || (startDate && endDate))) {
        Object.assign(requestData, dateParams);
      }
      
      const accessToken = localStorage.getItem('access');
      
      const response = await axios.post(
        `${apiEndpoint}sales_performance`, 
        requestData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': accessToken ? `Bearer ${accessToken}` : ''
          }
        }
      );
      
      if (response.data) {
        const responseData = response.data.data || response.data;
        // Store exact API response without modifications
        setSalesData({
          top_selling: responseData.top_selling || [],
          low_selling: responseData.low_selling || []
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load sales data. Please try again.");
    } finally {
      if (!isReloadAction) {
        setLoading(false);
      }
      setIsReloading(false);
    }
  };

  const handleReload = () => {
    if (startDate && endDate) {
      fetchData('Custom Range', true);
    } else {
      fetchData(dateRange, true);
    }
  };

  // Handle date range selection
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === "Custom Range");
    
    if (range !== "Custom Range") {
      setStartDate(null);
      setEndDate(null);
      fetchData(range);
    }
  };

  // Handle custom date selection
  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchData("Custom Range");
    }
  };

  // Determine current loading state
  const isLoading = userInteracted ? loading : contextLoading;
  // Determine current error state
  const currentError = userInteracted ? error : contextError;

  // Render date options dropdown
  const renderDateOptions = () => {
    const dateOptions = [
      "All Time",
      "Today",
      "Yesterday",
      "Last 7 Days",
      "Last 30 Days",
      "Current Month",
      "Last Month",
      "Custom Range"
    ];
    
    return (
      <div className="dropdown">
        <button
          type="button"
          className="btn btn-outline-primary dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          <i className="fas fa-calendar me-2"></i>
          {dateRange}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {dateOptions.map((option) => (
            <li key={option}>
              <a
                href="javascript:void(0);"
                className="dropdown-item"
                onClick={() => handleDateRangeChange(option)}
              >
                {option}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Add event listener for header reload
  useEffect(() => {
    const handleHeaderReload = () => {
      setDateRange('All Time');
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(false);
      setUserInteracted(false);
      fetchData('All Time');
    };

    window.addEventListener('resetFiltersToAllTime', handleHeaderReload);
    return () => window.removeEventListener('resetFiltersToAllTime', handleHeaderReload);
  }, []);

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Products Analysis</h5>
      </div>

      {/* Body */}
      <div className="card-body">
        {/* Tabs */}
        <div className="nav nav-tabs mb-3">
          <button
            className={`nav-link ${selectedTab === "top" ? "active" : ""}`}
            onClick={() => setSelectedTab("top")}
            style={{
              fontWeight: selectedTab === "top" ? "bold" : "normal",
              borderRadius: "8px",
              backgroundColor:
                selectedTab === "top" ? "var(--bs-primary)" : "transparent",
              color: selectedTab === "top" ? "var(--bs-white)" : "",
            }}
          >
            Top Selling
          </button>
          <button
            className={`nav-link ${selectedTab === "low" ? "active" : ""}`}
            onClick={() => setSelectedTab("low")}
            style={{
              fontWeight: selectedTab === "low" ? "bold" : "normal",
              borderRadius: "8px",
              backgroundColor:
                selectedTab === "low" ? "var(--bs-primary)" : "transparent",
              color: selectedTab === "low" ? "var(--bs-white)" : "",
            }}
          >
            Low Selling
          </button>
        </div>

        {/* Error message */}
        {currentError && (
          <div className="alert alert-danger" role="alert">
            {currentError}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="text-center p-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          renderDataTable()
        )}
      </div>
    </div>
  );
}

export default TopSell;
