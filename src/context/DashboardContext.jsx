import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import { useNavigate } from 'react-router-dom';

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
  const [menuCombos_from_context, setMenuCombos] = useState(null);
  
  // Original loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  
  // Add refs to track API call status
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const initialFetchCompletedRef = useRef(false);

  const navigate = useNavigate();

  // Check if we're already on the login page to prevent redirect loops
  const isLoginPage = () => {
    return window.location.pathname.includes('/login');
  };

  // Check if user just logged in (token was saved in the last 10 seconds)
  const isRecentLogin = useCallback(() => {
    const tokenTimestamp = localStorage.getItem('token_timestamp');
    if (!tokenTimestamp) return false;
    
    const now = Date.now();
    const tokenTime = parseInt(tokenTimestamp, 10);
    return now - tokenTime < 10000; // 10 seconds
  }, []);

  // Check credentials and log their status
  const getAuthCredentials = useCallback(() => {
    const accessToken = localStorage.getItem('access');
    const outletId = localStorage.getItem('outlet_id');
    const tokenTimestamp = localStorage.getItem('token_timestamp');
    
    // Log auth details in development (locally triggered logs are fine)
    console.log('Auth status check:', { 
      hasAccessToken: !!accessToken, 
      hasOutletId: !!outletId,
      tokenLength: accessToken ? accessToken.length : 0,
      currentPath: window.location.pathname,
      tokenAge: tokenTimestamp ? Math.floor((Date.now() - parseInt(tokenTimestamp, 10)) / 1000) + ' seconds' : 'unknown',
      isRecentLogin: isRecentLogin()
    });
    
    setTokenChecked(true);
    
    return { accessToken, outletId };
  }, [isRecentLogin]);

  // Effect to handle login redirect if needed, but prevent loops
  useEffect(() => {
    if (shouldRedirectToLogin && !isLoginPage()) {
      console.log('Redirecting to login page from', window.location.pathname);
      navigate('/login');
    }
  }, [shouldRedirectToLogin, navigate]);

  const fetchDashboardData = useCallback(async (dateFilter = {}) => {
    // Skip if we're already fetching or on login page
    if (isFetchingRef.current || isLoginPage()) {
      console.log('Skipping fetch - already in progress or on login page');
      return;
    }
    
    // Prevent duplicate calls within 2 seconds
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000 && initialFetchCompletedRef.current) {
      console.log('Skipping duplicate API call, last call was', 
                 (now - lastFetchTimeRef.current), 'ms ago');
      return;
    }
    
    // Mark as fetching
    isFetchingRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get auth credentials
      const { accessToken, outletId } = getAuthCredentials();
      
      if (!accessToken || !outletId) {
        console.warn('Missing authentication credentials in localStorage');
        // Only redirect if not already on login page
        if (!isLoginPage()) {
          setShouldRedirectToLogin(true);
        }
        throw new Error('Missing authentication credentials. Please login again.');
      }

      const deviceToken = localStorage.getItem('device_token');
      const userRole = localStorage.getItem('role');

      if (!deviceToken) {
        setError('Device token not found. Please login again.');
        navigate('/login');
        return;
      }

      const requestBody = {
        outlet_id: parseInt(outletId, 10),
        device_token: deviceToken,
        role: userRole
      };

      console.log('Context API request data:', requestBody);
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };
      
      // Make the API call
      const response = await axios.post(
        `https://men4u.xyz/1.3/outlet_statistics/get_all_stats_without_filter`,
        requestBody,
        { headers }
      );

      if (response.data.st === 5) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      if (response.data.message === 'success') {
        const stats = response.data.data;
        console.log('API Response Data:', stats);
        console.log('Menu Combos Data from API:', stats.menu_combos || stats.top_combos);
        
        // Set individual state variables for each category
        setAnalyticReports(stats.analytic_reports || null);
        setOrderAnalytics(stats.order_analytics || null);
        setFoodTypeStatistics(stats.food_type_statistics || null);
        setOrderTypeStatistics(stats.order_type_statistics || null);
        setOrderStatistics(stats.order_statistics || null);
        setTotalCollectionSource(stats.total_collection_source || null);
        setSalesPerformance(stats.sales_performance || null);
        setWeeklyOrderStats(stats.weekly_order_stats || null);
        setMenuCombos(stats.menu_combos || stats.top_combos || null);
        
        setError(null);
        lastFetchTimeRef.current = Date.now();
        initialFetchCompletedRef.current = true;
      } else {
        throw new Error('Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error('Error details:', err);
      
      // Handle 401 unauthorized by redirecting to login
      if (err.response?.status === 401 && !isLoginPage()) {
        console.error('Authentication failed. Redirecting to login.');
        setShouldRedirectToLogin(true);
        setError('Session expired. Please login again.');
        return;
      }
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message ||
                          err.message || 'Failed to fetch statistics';
      
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      // Release the fetching lock
      isFetchingRef.current = false;
    }
  }, [getAuthCredentials, isLoginPage, navigate]);

  useEffect(() => {
    // Skip data fetching if we're on the login page
    if (isLoginPage()) {
      console.log('On login page, skipping initial data fetch');
      setLoading(false);
      return;
    }
    
    // If we've already completed the initial fetch, don't do it again
    if (initialFetchCompletedRef.current) {
      console.log('Initial fetch already completed, skipping');
      return;
    }
    
    // Check for recent login, which might need special handling
    const isRecent = isRecentLogin();
    console.log('Initial load check - recent login:', isRecent);
    
    // Add a small delay to ensure login data is fully processed
    // Use a shorter delay for recent logins to improve responsiveness
    const delay = isRecent ? 100 : 500;
    
    const initialDataFetchTimer = setTimeout(() => {
      fetchDashboardData();
    }, delay);
    
    // Clean up the timer if component unmounts
    return () => clearTimeout(initialDataFetchTimer);
  }, [fetchDashboardData, isLoginPage, isRecentLogin]);

  // Make sure refreshDashboard is properly memoized with useCallback
  const refreshDashboard = useCallback((dateFilter = {}) => {
    console.log('Dashboard refresh requested with filter:', dateFilter);
    fetchDashboardData(dateFilter);
  }, [fetchDashboardData]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    // Provide separate objects for each data category with _from_context suffix
    analyticReports_from_context,
    orderAnalytics_from_context,
    foodTypeStatistics_from_context,
    orderTypeStatistics_from_context,
    orderStatistics_from_context,
    totalCollectionSource_from_context,
    salesPerformance_from_context,
    weeklyOrderStats_from_context,
    menuCombos_from_context,
    
    // Maintain original loading and error states
    loading,
    error,
    refreshDashboard,
    tokenChecked,
    isRecentLogin: isRecentLogin()
  }), [
    analyticReports_from_context,
    orderAnalytics_from_context,
    foodTypeStatistics_from_context,
    orderTypeStatistics_from_context,
    orderStatistics_from_context,
    totalCollectionSource_from_context,
    salesPerformance_from_context,
    weeklyOrderStats_from_context,
    menuCombos_from_context,
    loading,
    error,
    refreshDashboard,
    tokenChecked,
    isRecentLogin
  ]);

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