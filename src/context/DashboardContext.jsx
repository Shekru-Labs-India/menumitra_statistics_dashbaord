import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Individual state variables for each data category with _from_context suffix
  const [analyticReports_from_context, setAnalyticReports] = useState(null);
  const [orderAnalytics_from_context, setOrderAnalytics] = useState(null);
  const [foodTypeStatistics_from_context, setFoodTypeStatistics] = useState(null);
  const [orderTypeStatistics_from_context, setOrderTypeStatistics] = useState(null);
  const [orderStatistics_from_context, setOrderStatistics] = useState(null);
  const [totalCollectionSource_from_context, setTotalCollectionSource] = useState(null);
  const [salesPerformance_from_context, setSalesPerformance] = useState(null);
  const [weeklyOrderStats_from_context, setWeeklyOrderStats] = useState(null);
  
  // Original loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (dateFilter = null) => {
    try {
      setLoading(true);
      const outletId = localStorage.getItem('outlet_id');
      const accessToken = localStorage.getItem('access'); // Get the access token

      if (!outletId || !accessToken) {
        throw new Error('Missing required credentials');
      }

      // Prepare request body with date filters if provided
      const requestBody = { outlet_id: outletId };
      
      // Add date filter if provided
      if (dateFilter) {
        if (dateFilter.startDate) requestBody.start_date = dateFilter.startDate;
        if (dateFilter.endDate) requestBody.end_date = dateFilter.endDate;
        if (dateFilter.filterType) requestBody.filter_type = dateFilter.filterType; // today, yesterday, week, month, etc.
      }

      const response = await axios.post(
        'https://men4u.xyz/outlet_statistics/get_all_stats_without_filter',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data && response.data.message === "success") {
        const data = response.data.data;
        
        // Set individual state variables for each category
        setAnalyticReports(data.analytic_reports || null);
        setOrderAnalytics(data.order_analytics || null);
        setFoodTypeStatistics(data.food_type_statistics || null);
        setOrderTypeStatistics(data.order_type_statistics || null);
        setOrderStatistics(data.order_statistics || null);
        setTotalCollectionSource(data.total_collection_source || null);
        setSalesPerformance(data.sales_performance || null);
        setWeeklyOrderStats(data.weekly_order_stats || null);
        
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
      // Handle 401 unauthorized error
      if (err.response?.status === 401) {
        // You might want to redirect to login or handle token refresh here
        console.error('Unauthorized access - token might be expired');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const value = {
    // Provide separate objects for each data category with _from_context suffix
    analyticReports_from_context,
    orderAnalytics_from_context,
    foodTypeStatistics_from_context,
    orderTypeStatistics_from_context,
    orderStatistics_from_context,
    totalCollectionSource_from_context,
    salesPerformance_from_context,
    weeklyOrderStats_from_context,
    
    // Maintain original loading and error states
    loading,
    error,
    refreshDashboard: fetchDashboardData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 