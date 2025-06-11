import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import { useDashboard } from '../context/DashboardContext'; // Import context

const TopCombos = () => {
  // Get data from context
  const { 
    menuCombos_from_context,
    loading: contextLoading,
    error: contextError
  } = useDashboard();

  // State management
  const [dateRange, setDateRange] = useState("All Time");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const [menuCombos, setMenuCombos] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);

  // Use context data when component mounts
  useEffect(() => {
    console.log('Raw Context Data:', menuCombos_from_context);
    
    if (menuCombos_from_context) {
      // Check if the data is nested under menu_combos
      const combosData = menuCombos_from_context.menu_combos || 
                        menuCombos_from_context.top_combos || 
                        (Array.isArray(menuCombos_from_context) ? menuCombos_from_context : []);
      
      console.log('Processed Combos Data:', combosData);
      
      if (combosData && combosData.length > 0) {
        console.log('Setting Menu Combos:', combosData);
        setMenuCombos(combosData);
      } else {
        console.log('No combo data found in:', menuCombos_from_context);
        setMenuCombos([]);
      }
    } else {
      console.log('No context data available');
      setMenuCombos([]);
    }
  }, [menuCombos_from_context]);

  // Set error from context if available
  useEffect(() => {
    if (contextError && !userInteracted) {
      console.log('Context Error:', contextError);
      setError(contextError);
    }
  }, [contextError, userInteracted]);

  // Log when menuCombos state changes
  useEffect(() => {
    console.log('Current menuCombos state:', menuCombos);
  }, [menuCombos]);

  // Format date for display and API
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}`;
  };

  // Add capitalize function
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch menu combos data with filters
  const fetchMenuCombos = async (isReloadAction = false) => {
    try {
      if (!isReloadAction) {
        setLoading(true);
      }
      setError(null);
      setUserInteracted(true);

      const outletId = localStorage.getItem('outlet_id');
      const deviceToken = localStorage.getItem('device_token');
      const userRole = localStorage.getItem('role');
      const accessToken = localStorage.getItem('access');

      if (!outletId || !deviceToken || !userRole) {
        throw new Error('Required credentials not found');
      }

      const requestData = {
        outlet_id: parseInt(outletId),
        device_token: deviceToken,
        role: userRole
      };

      // Add date range parameters if selected
      if (startDate && endDate) {
        requestData.start_date = formatDate(startDate);
        requestData.end_date = formatDate(endDate);
      }

      const response = await axios.post(
        `${apiEndpoint}get_menu_combos`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.message === 'success') {
        setMenuCombos(response.data.data.top_combos || []);
      } else {
        throw new Error('Failed to fetch menu combos');
      }
    } catch (err) {
      console.error('Error fetching menu combos:', err);
      setError(err.message || 'Failed to load menu combos');
    } finally {
      if (!isReloadAction) {
        setLoading(false);
      }
      setIsReloading(false);
    }
  };

  // Handle date range selection
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowDatePicker(range === "Custom Range");
    
    if (range !== "Custom Range") {
      setStartDate(null);
      setEndDate(null);
      fetchMenuCombos();
    }
  };

  // Handle reload button click
  const handleReload = () => {
    setIsReloading(true);
    if (startDate && endDate) {
      fetchMenuCombos(true);
    } else {
      fetchMenuCombos(true);
    }
  };

  // Handle custom date selection
  const handleCustomDateSelect = () => {
    if (startDate && endDate) {
      setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setShowDatePicker(false);
      fetchMenuCombos();
    }
  };

  // Add event listener for header reload
  useEffect(() => {
    const handleHeaderReload = () => {
      setDateRange('All Time');
      setStartDate(null);
      setEndDate(null);
      setShowDatePicker(false);
      setUserInteracted(false);
    };

    window.addEventListener('resetFiltersToAllTime', handleHeaderReload);
    return () => window.removeEventListener('resetFiltersToAllTime', handleHeaderReload);
  }, []);

  // Determine current loading state
  const isLoading = userInteracted ? loading : contextLoading;
  // Determine current error state
  const currentError = userInteracted ? error : contextError;

  return (
    <div className="card h-100">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Top Combo Orders</h5>
      </div>

      {/* Error message */}
      {currentError && (
        <div className="alert alert-danger m-3" role="alert">
          {currentError}
        </div>
      )}

      {/* Body */}
      <div className="card-body">
        {isLoading ? (
          <div className="text-center p-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : menuCombos && menuCombos.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Combo Items</th>
                  <th className="text-end">Order Count</th>
                </tr>
              </thead>
              <tbody>
                {[...menuCombos]
                  .sort((a, b) => {
                    // First sort by count in descending order
                    const countA = a.order_count || a.count || 0;
                    const countB = b.order_count || b.count || 0;
                    
                    if (countB !== countA) {
                      return countB - countA; // Sort by count descending
                    }
                    
                    // If counts are equal, sort alphabetically combos
                    const aItems = Array.isArray(a.items) 
                      ? a.items.map(item => capitalizeWords(item.name || item)).join(' + ')
                      : capitalizeWords(a.items);
                    const bItems = Array.isArray(b.items)
                      ? b.items.map(item => capitalizeWords(item.name || item)).join(' + ')
                      : capitalizeWords(b.items);
                    
                    return aItems.localeCompare(bItems);
                  })
                  .map((combo, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {Array.isArray(combo.items) ? combo.items.map((item, itemIndex) => (
                          <React.Fragment key={item.menu_id || itemIndex}>
                            <span className="badge bg-gray-500 text-dark me-1">
                              {capitalizeWords(item.name || item)}
                            </span>
                            {itemIndex < combo.items.length - 1 && (
                              <i className="fas fa-plus mx-1 text-muted"></i>
                            )}
                          </React.Fragment>
                        )) : (
                          <span className="badge bg-secondary text-dark me-1">
                            {capitalizeWords(combo.items)}
                          </span>
                        )}
                      </td>
                      <td className="text-end">{combo.order_count || combo.count || 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted p-3">
            No combo orders available for the selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCombos;