import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoint } from '../config/menuMitraConfig';
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img from '../assets/img/avatars/1.png';

const MyProfile = () => {
  const [userDetails, setUserDetails] = useState({
    user_id: '',
    name: '',
    role: '',
    dob: null,
    email: null,
    mobile_number: '',
    aadhar_number: '',
    last_login: '',
    created_on: '',
    updated_on: null,
    created_by: '',
    updated_by: null,
    subscription_outlet: []
  });
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper function to get auth headers
  const getAuthHeaders = (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          setError('User ID not found');
          return;
        }

        const response = await axios.post('https://men4u.xyz/common_api/view_profile_detail', 
          { 
            user_id: user_id,
            outlet_id: localStorage.getItem('outlet_id'),
            device_token: localStorage.getItem('device_token') || '',
            device_id: localStorage.getItem('device_id') || ''
          },
          { headers: getAuthHeaders() }
        );

        if (response.data.st === 1 && response.data.Data.user_details) {
          const userData = response.data.Data.user_details;
          const subscriptionData = response.data.Data.subscription_outlet?.[0] || {};
          
          // Format the date of birth for display
          const formattedUserData = {
            ...userData,
            dob: userData.dob ? formatDateForDisplay(userData.dob) : 'Not provided',
            subscription_outlet: response.data.Data.subscription_outlet || []
          };
          
          setUserDetails(formattedUserData);
          setFormData({
            ...formattedUserData,
            dob: userData.dob ? formatDateForInput(userData.dob) : ''
          });
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        const errorMessage = handleApiError(error);
        setError(errorMessage || 'Failed to fetch user profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    // Reset form data when entering edit mode
    if (!editMode) {
      setFormData({ ...userDetails });
    }
    // Clear any messages
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Format date to match API requirement (e.g., "06 oct 1990")
      const formatDateForAPI = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
      };

      const payload = {
        update_user_id: Number(localStorage.getItem("user_id")),
        user_id: Number(localStorage.getItem("user_id")),
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        dob: formatDateForAPI(formData.dob),
        aadhar_number: formData.aadhar_number,
        outlet_id: localStorage.getItem('outlet_id'),
        device_token: localStorage.getItem('device_token') || '',
        device_id: localStorage.getItem('device_id') || ''
      };

      const response = await axios({
        method: 'post',
        url: 'https://men4u.xyz/common_api/update_profile_detail',
        headers: getAuthHeaders(),
        data: payload
      });

      if (response.data.st === 1) {
        // Get current timestamp
        const now = new Date();
        const formattedTimestamp = now.toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          second: '2-digit'
        });

        // Update state with formatted date and new timestamp
        const updatedUserDetails = {
          ...formData,
          dob: formatDateForDisplay(formData.dob),
          updated_on: formattedTimestamp,
          updated_by: userDetails.name // Using the user's name as the updater
        };

        setUserDetails(updatedUserDetails);
        setSuccess(response.data.msg || 'Profile updated successfully!');
        setEditMode(false);
      } else {
        setError(response.data.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display in view mode
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return 'Not provided';
    try {
      // If the date is already in "DD MMM YYYY" format, return it as is
      if (typeof dateStr === 'string' && dateStr.match(/^\d{2} [A-Za-z]{3} \d{4}$/)) {
        return dateStr;
      }
      
      // If it's a date object or ISO string, format it
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Not provided';
      
      const day = String(date.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Not provided';
    }
  };

  // Format date for input field
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try {
      // If the date is in "DD MMM YYYY" format, convert it to YYYY-MM-DD
      if (typeof dateStr === 'string' && dateStr.match(/^\d{2} [A-Za-z]{3} \d{4}$/)) {
        const [day, month, year] = dateStr.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        const date = new Date(year, monthIndex, day);
        return date.toISOString().split('T')[0];
      }
      
      // If it's a date object or ISO string, format it
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };

  // Create a gradient background based on the role
  const getBannerGradient = () => {
    return 'linear-gradient(135deg, rgb(107, 70, 193) 0%, rgb(159, 122, 234) 50%, rgb(183, 148, 244) 100%)';
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          <div className="content-wrapper flex-grow-1">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* Error and Success Messages */}
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success mb-4" role="alert">
                  {success}
                </div>
              )}

              {/* Profile Card with Banner */}
              <div className="card mb-5">
                {/* Colorful Banner */}
                <div
                  className="card-header p-0"
                  style={{
                    height: "230px",
                    background: getBannerGradient(),
                    borderTopLeftRadius: "inherit",
                    borderTopRightRadius: "inherit",
                  }}
                ></div>

                {/* Profile Info Section */}
                <div className="card-body position-relative pt-4 pb-3 px-4">
                  {/* Profile Image */}
                  <div
                    className="position-absolute"
                    style={{ top: "-75px", left: "35px" }}
                  >
                    <div
                      className="avatar avatar-xl"
                      style={{
                        width: "110px",
                        height: "110px",
                        border: "5px solid white",
                        borderRadius: "8px",
                        background: "white",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={img}
                        alt="Profile Image"
                        className="w-100 h-100"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                    </div>
                  </div>

                  {/* Profile Details and Edit Button */}
                  <div className="d-flex justify-content-between align-items-center mt-4 mb-2 ps-2">
                    <div className="ms-5 ">
                      <div className="mt-2 fs-5 fw-bold">
                        {userDetails.name}
                      </div>
                      <small className="text-muted mb-1">
                        {userDetails.role}
                      </small>
                      {/* <div className="d-flex flex-wrap gap-3">
                        <span className="text-muted">
                          <i className="fas fa-user-tag me-1"></i>
                          {userDetails.role}
                        </span>
                        <span className="text-muted">•</span>
                        <span className="text-muted">
                          <i className="fas fa-id-card me-1"></i>
                          {userDetails.aadhar_number}
                        </span>
                      </div> */}
                    </div>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={handleEditToggle}
                    >
                      <i
                        className={`fas ${
                          editMode ? "fa-times" : "fa-edit"
                        } me-2`}
                      ></i>
                      {editMode ? "Cancel" : "Update Profile"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title text-uppercase mb-4 fw-bold">
                        <i className="fas fa-user-circle me-2 text-primary"></i>
                        ABOUT
                      </h5>

                      {!editMode ? (
                        <div className="ps-2">
                          <div className="mb-4">
                            <div className="fs-5 fw-bold">
                              {userDetails.name}
                            </div>
                            <div className="text-muted small mb-1">Name</div>
                          </div>

                          <div className="mb-4">
                            <div className="fs-5 fw-bold">
                              {userDetails.email || "Not provided"}
                            </div>
                            <div className="text-muted small mb-1">Email</div>
                          </div>

                          <div className="mb-4">
                            <div className="fs-5 fw-bold">
                              {userDetails.mobile_number}
                            </div>
                            <div className="text-muted small mb-1">Mobile</div>
                          </div>

                          <div className="mb-4">
                            <div className="fs-5 fw-bold">
                              {userDetails.aadhar_number}
                            </div>
                            <div className="text-muted small mb-1">
                              Aadhar Number
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="fs-5 fw-bold">
                              {formatDateForDisplay(userDetails.dob)}
                            </div>
                            <div className="text-muted small mb-1">
                              Date of Birth
                            </div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="px-2">
                          <div className="mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="name"
                              value={formData.name || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your name"
                            />
                            <label className="form-label">Name</label>
                          </div>

                          <div className="mb-4">
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              name="email"
                              value={formData.email || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                            />
                            <label className="form-label">Email</label>
                          </div>

                          <div className="mb-4">
                            <input
                              type="tel"
                              className="form-control form-control-lg"
                              name="mobile_number"
                              value={formData.mobile_number || ""}
                              onChange={handleInputChange}
                              placeholder="Enter mobile number"
                              disabled
                            />
                            <label className="form-label">Mobile Number</label>

                            <small className="text-danger ms-2">
                              (Mobile number cannot be changed as it's used for
                              login.)
                            </small>
                          </div>

                          <div className="mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="aadhar_number"
                              value={formData.aadhar_number || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your aadhar number"
                            />
                            <label className="form-label">Aadhar Number</label>
                          </div>

                          <div className="mb-4">
                            <div className="position-relative">
                              <input
                                type="date"
                                className="form-control form-control-lg"
                                name="dob"
                                value={formData.dob || ""}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split('T')[0]}
                                style={{
                                  paddingRight: "2.5rem"
                                }}
                              />
                              <label className="form-label">Date of Birth</label>
                            </div>
                          </div>

                          <div className="mt-5">
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg w-100"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <i className="fas fa-circle-notch fa-spin me-2"></i>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-save me-2"></i>Save
                                  Changes
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title text-uppercase mb-4 fw-bold">
                        <i className="fas fa-store me-2 text-primary"></i>
                        ACCOUNT INFORMATION
                      </h5>
                      {/* <div className="ps-2">
                        {userDetails.subscription_outlet.length > 0 ? (
                          <div className="row g-3">
                            {userDetails.subscription_outlet.map((outlet) => (
                              <div
                                key={outlet.outlet_id}
                                className="col-12 col-md-6"
                              >
                                <div className="card p-0 h-100">
                                  <div className="card-header py-2 px-3 d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="card-title mb-0 fw-bold">
                                      {outlet.outlet_name}
                                    </h6>
                                    <div className="meta">
                                      <span className="badge rounded-pill bg-label-primary small me-2">
                                        {outlet.subscription_name}
                                      </span>
                                      <span
                                        className={`badge rounded-pill bg-label-${
                                          outlet.days_until_expiry > 30
                                            ? "success"
                                            : "warning"
                                        } small`}
                                      >
                                        {outlet.days_until_expiry > 30
                                          ? "Active"
                                          : "Expiring Soon"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="card-body py-2 px-3">
                                    <div className="row g-2">
                                      <div className="col-8">
                                        <div className="d-flex align-items-center">
                                          <i className="fas fa-calendar-alt text-primary me-2 small"></i>
                                          <div>
                                            <small className="d-block  fw-bold">
                                              {outlet.subscription_date} to{" "}
                                              {outlet.expiry_date}
                                            </small>
                                            <small className="text-muted d-block">
                                              Subscription Period
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-4">
                                        <div className="d-flex align-items-center">
                                          <i className="fas fa-clock text-primary me-2 small"></i>
                                          <div>
                                            <small className="d-block fw-bold">
                                              {outlet.days_until_expiry} days
                                            </small>
                                            <small className="text-muted d-block">
                                              Days Until Expiry
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-8">
                                        <div className="d-flex align-items-center">
                                          <i className="fas fa-hourglass-half text-primary me-2 small"></i>
                                          <div>
                                            <small className="d-block fw-bold">
                                              {outlet.tenure} months
                                            </small>
                                            <small className="text-muted d-block">
                                              Tenure
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-4">
                                        <div className="d-flex align-items-center">
                                          <i className="fas fa-rupee-sign text-primary me-2 small"></i>
                                          <div>
                                            <small className="d-block fw-bold">
                                              ₹{outlet.price}
                                            </small>
                                            <small className="text-muted d-block">
                                              Price
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <i className="fas fa-store fa-3x text-muted mb-3"></i>
                            <p className="text-muted mb-0">
                              No outlets available
                            </p>
                          </div>
                        )}
                      </div> */}
                      <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                          <div className="d-flex flex-column">
                            <span className="fw-bold">
                              {userDetails.created_on}
                            </span>
                            <small className="text-muted mb-1">
                              Created On
                            </small>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <div className="d-flex flex-column">
                            <span className="fw-bold">
                              {userDetails.created_by}
                            </span>
                            <small className="text-muted mb-1">
                              Created By
                            </small>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <div className="d-flex flex-column">
                            <span className="fw-bold">
                              {userDetails.updated_on}
                            </span>
                            <small className="text-muted mb-1">
                              Updated On
                            </small>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <div className="d-flex flex-column">
                            <span className="fw-bold">
                              {userDetails.updated_by}
                            </span>
                            <small className="text-muted mb-1">
                              Updated By
                            </small>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-bold">
                            {userDetails.last_login}
                          </span>
                          <small className="text-muted mb-1">Last Login</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;