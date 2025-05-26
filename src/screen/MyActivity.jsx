import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Card, CardContent, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Pagination, Typography
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import VerticalSidebar from '../components/VerticalSidebar';
import Header from '../components/Header';
import debounce from 'lodash/debounce';

const MyActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    recordsPerPage: 25,
    showingRecords: '0 to 0'
  });
  const itemsPerPage = 20;
  const navigate = useNavigate();

  // Memoized axios instance
  const api = useMemo(() => axios.create({
    baseURL: 'https://menusmitra.xyz',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    }
  }), []);

  useEffect(() => {
    fetchActivityLog(page, searchTerm);
  }, [page, searchTerm]);

  const fetchActivityLog = async (currentPage, search = '') => {
    try {
      setLoading(true);
      setError('');

      const userId = localStorage.getItem('user_id');
      const deviceToken = localStorage.getItem('device_token');
      
      if (!userId || !deviceToken) {
        setError('Authentication information missing. Please login again.');
        navigate('/login');
        return;
      }

      const response = await api.post('/common_api/activity_log', {
        user_id: parseInt(userId),
        device_token: deviceToken,
        device_id: localStorage.getItem('device_id') || '',
        outlet_id: localStorage.getItem('outlet_id'),
        page: currentPage,
        per_page: itemsPerPage,
        search: search
      });

      if (response.data) {
        setActivities(response.data.activity_logs || []);
        setPaginationInfo({
          totalRecords: response.data.pagination.total_records,
          currentPage: response.data.pagination.current_page,
          totalPages: response.data.pagination.total_pages,
          recordsPerPage: response.data.pagination.records_per_page,
          showingRecords: response.data.pagination.showing_records
        });
      } else {
        setActivities([]);
        setPaginationInfo({
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          recordsPerPage: 25,
          showingRecords: '0 to 0'
        });
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch activity log');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchActivityLog(1, value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="d-flex justify-content-between align-items-center py-3 mb-4">
                <h4 className="fw-bold mb-0">Activity Log</h4>
                {/* <div className="search-container" style={{ maxWidth: '300px', width: '100%' }}>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: 'transparent' }}>
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{
                        borderLeft: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div> */}
              </div>
              <Card>
                <CardContent>
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontWeight: 'bold' , fontSize: '16px'}}>Date & Time</TableCell>
                              <TableCell style={{ fontWeight: 'bold' , fontSize: '16px'}}>Activity</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {activities.map((activity) => (
                              <TableRow key={activity.activity_log_id}>
                                <TableCell>{formatDate(activity.created_on)}</TableCell>
                                <TableCell>{activity.title}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                        <Typography variant="body2" color="text.secondary">
                          Showing records {paginationInfo.showingRecords} of {paginationInfo.totalRecords} total records
                        </Typography>
                        <Pagination 
                          count={paginationInfo.totalPages} 
                          page={paginationInfo.currentPage} 
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivity;