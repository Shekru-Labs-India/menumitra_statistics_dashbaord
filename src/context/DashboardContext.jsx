import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const outletId = localStorage.getItem('outlet_id');
      const accessToken = localStorage.getItem('access'); // Get the access token

      if (!outletId || !accessToken) {
        throw new Error('Missing required credentials');
      }

      const response = await axios.post(
        'https://men4u.xyz/outlet_statistics/get_all_stats_without_filter',
        { outlet_id: outletId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data && response.data.message === "success") {
        setDashboardData(response.data.data);
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
    dashboardData,
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