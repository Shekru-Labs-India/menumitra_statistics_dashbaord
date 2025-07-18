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
  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState({
    top_selling: { items: [], pagination: {} },
    low_selling: { items: [], pagination: {} }
  });
  const [error, setError] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const entriesOptions = [10, 20, 50, 100];

  // Use context data when component mounts
  useEffect(() => {
    if (salesPerformance_from_context) {
      setSalesData({
        top_selling: salesPerformance_from_context.top_selling || { items: [], pagination: {} },
        low_selling: salesPerformance_from_context.low_selling || { items: [], pagination: {} }
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

  // Get the current data to display based on selected tab and search query
  const getCurrentData = () => {
    const baseData = selectedTab === "top" 
      ? salesData.top_selling?.items 
      : salesData.low_selling?.items;
    
    // Ensure baseData is an array
    if (!Array.isArray(baseData)) {
      return [];
    }
    
    // Filter data based on search query
    if (!searchQuery || searchQuery.trim() === "") {
      return baseData;
    }
    
    return baseData.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get current pagination data
  const getCurrentPagination = () => {
    return selectedTab === "top" 
      ? salesData.top_selling?.pagination 
      : salesData.low_selling?.pagination;
  };

  // Handle entries per page change
  const handleEntriesChange = (e) => {
    const newEntriesPerPage = parseInt(e.target.value);
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1); // Reset to first page when changing entries
    fetchData(dateRange, false, 1, newEntriesPerPage);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(dateRange, false, newPage, entriesPerPage);
  };

  // Modify getPageNumbers to show sliding window of 3 pages
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the three pages to show
    let pages = [];
    
    // If we're at page 1, show 1,2,3
    if (currentPage === 1) {
      pages = [1, 2, 3];
    }
    // If we're at the last page, show last-2, last-1, last
    else if (currentPage === totalPages) {
      pages = [totalPages - 2, totalPages - 1, totalPages];
    }
    // If we're at the second-to-last page, show last-2, last-1, last
    else if (currentPage === totalPages - 1) {
      pages = [totalPages - 2, totalPages - 1, totalPages];
    }
    // Otherwise show current, current+1, current+2
    else {
      pages = [currentPage, currentPage + 1, currentPage + 2];
    }

    // Add ellipsis and last page if not showing last pages
    if (pages[2] < totalPages - 1) {
      pages.push('...', totalPages);
    }
    
    // Add first page and ellipsis if not showing first pages
    if (pages[0] > 2) {
      pages.unshift('...', 1);
    }

    return pages;
  };

  // Modify renderDataTable to use the new pagination UI
  const renderDataTable = () => {
    const data = getCurrentData();
    const pagination = getCurrentPagination();
    
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center text-muted p-3">
          No products data available for the selected period
        </div>
      );
    }
    
    return (
      <>
        <div className="table-responsive mb-3">
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
                  <td>{((pagination.current_page - 1) * pagination.entries_per_page) + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.sales_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controls container */}
        <div className="d-flex flex-column gap-2">
          {/* Showing entries text */}
          <div className="text-center text-lg-start text-muted" style={{ fontSize: '0.75rem' }}>
            Showing {((pagination.current_page - 1) * pagination.entries_per_page) + 1} to {Math.min(pagination.current_page * pagination.entries_per_page, pagination.total_items)} of {pagination.total_items} entries
          </div>

          {/* Controls row - entries and pagination on same line */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
            {/* Entries per page selector */}
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start" style={{ fontSize: '0.8rem' }}>
              <span className="me-1">Show</span>
              <select 
                className="form-select form-select-sm" 
                value={entriesPerPage}
                onChange={handleEntriesChange}
                style={{ 
                  width: '45px',
                  height: '24px',
                  padding: '2px 2px 2px 4px',
                  fontSize: '0.8rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '3px',
                  backgroundPosition: 'right 2px center',
                  marginRight: '4px'
                }}
              >
                {entriesOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            {/* Pagination controls */}
            {pagination && pagination.total_pages > 1 && (
              <div className="d-flex align-items-center flex-wrap gap-1 justify-content-center justify-content-lg-end">
                <button 
                  className="btn btn-outline-primary py-0 px-2"
                  style={{ 
                    fontSize: '0.75rem', 
                    minWidth: '45px', 
                    height: '24px', 
                    lineHeight: '22px'
                  }}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={!pagination.has_previous}
                >
                  Prev
                </button>
                
                {getPageNumbers(pagination.current_page, pagination.total_pages).map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-1" style={{ fontSize: '0.75rem' }}>...</span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      className={`btn py-0 px-2 ${page === pagination.current_page ? 'btn-primary' : 'btn-outline-primary'}`}
                      style={{ 
                        fontSize: '0.75rem', 
                        minWidth: '24px', 
                        height: '24px',
                        lineHeight: '22px',
                        padding: '0 6px'
                      }}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button 
                  className="btn btn-outline-primary py-0 px-2"
                  style={{ 
                    fontSize: '0.75rem', 
                    minWidth: '45px', 
                    height: '24px', 
                    lineHeight: '22px'
                  }}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={!pagination.has_next}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Modify fetchData to include pagination parameters
  const fetchData = async (range, isReloadAction = false, page = 1, perPage = entriesPerPage) => {
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
        device_id: localStorage.getItem('device_id') || '',
        page: page,
        entries: perPage
      };
      
      const dateParams = getDateRange(range);
      if (dateParams && (range !== "Custom Range" || (startDate && endDate))) {
        Object.assign(requestData, dateParams);
      }
      
      const accessToken = localStorage.getItem('access');
      
      const response = await axios.post(
        `${apiEndpoint}get_all_stats`, 
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
        setSalesData({
          top_selling: responseData.sales_performance.top_selling || { items: [], pagination: {} },
          low_selling: responseData.sales_performance.low_selling || { items: [], pagination: {} }
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

        {/* Search Bar */}
        <div className="mb-3">
          <div className="input-group" style={{ height: '32px' }}>
            <span className="input-group-text" style={{ padding: '4px 8px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by menu name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                padding: '4px 8px',
                height: '32px',
                minHeight: '32px',
                fontSize: '14px'
              }}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ 
                  padding: '4px 8px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
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
