import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import VerticalSidebar from '../components/VerticalSidebar';
import Header from '../components/Header';

const MyActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivityLog();
  }, []);

  const fetchActivityLog = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = localStorage.getItem('user_id');
      const deviceToken = localStorage.getItem('device_token');
      
      if (!userId) {
        setError('User ID not found. Please login again.');
        return;
      }

      if (!deviceToken) {
        setError('Device token not found. Please login again.');
        return;
      }

      const response = await axios.post('https://men4u.xyz/common_api/activity_log', {
        user_id: parseInt(userId),
        device_token: deviceToken,
        device_id: localStorage.getItem('device_id') || '',
        outlet_id: localStorage.getItem('outlet_id')
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (response.data && response.data.activity_logs) {
        setActivities(response.data.activity_logs);
      } else {
        setError('No activity logs found');
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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

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
              <h4 className="fw-bold py-3 mb-4">Activity Log</h4>
              <Card>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date & Time</TableCell>
                          {/* <TableCell>Module</TableCell> */}
                          {/* <TableCell>Sub Module</TableCell> */}
                          <TableCell>Activity</TableCell>
                          {/* <TableCell>Outlet ID</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activities.map((activity) => (
                          <TableRow key={activity.activity_log_id}>
                            <TableCell>{formatDate(activity.created_on)}</TableCell>
                            {/* <TableCell>{activity.module}</TableCell> */}
                            {/* <TableCell>{activity.sub_module}</TableCell> */}
                            <TableCell>{activity.title}</TableCell>
                            {/* <TableCell>{activity.outlet_id}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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