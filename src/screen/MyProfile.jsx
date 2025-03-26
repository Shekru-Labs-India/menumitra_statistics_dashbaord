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
          { user_id: user_id },
          { headers: getAuthHeaders() }
        );

        if (response.data.st === 1 && response.data.Data.user_details) {
          const userData = response.data.Data.user_details;
          const subscriptionData = response.data.Data.subscription_outlet?.[0] || {};
          
          const formattedUserData = {
            ...userData,
            subscription_outlet: response.data.Data.subscription_outlet || []
          };
          
          setUserDetails(formattedUserData);
          setFormData(formattedUserData);
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
      // Make API call to update profile
      const response = await axios.post(
        'https://men4u.xyz/common_api/update_profile',
        formData,
        { headers: getAuthHeaders() }
      );

      if (response.data.st === 1) {
        // Update localStorage
        Object.keys(formData).forEach(key => {
          if (formData[key]) {
            localStorage.setItem(key, formData[key]);
          }
        });

        // Update state
        setUserDetails(formData);
        setSuccess('Profile updated successfully!');
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

  // Create a gradient background based on the role
  const getBannerGradient = () => {
    const role = userDetails.role?.toLowerCase() || 'owner';
    switch(role) {
      case 'admin':
        return 'linear-gradient(135deg, #6B46C1 0%, #9F7AEA 50%, #B794F4 100%)';
      case 'manager':
        return 'linear-gradient(135deg, #2F855A 0%, #48BB78 50%, #68D391 100%)';
      case 'staff':
        return 'linear-gradient(135deg, #2B6CB0 0%, #4299E1 50%, #63B3ED 100%)';
      case 'owner':
      default:
        return 'linear-gradient(135deg, #4FD1C5 0%, #68D0CF 33%, #F6E05E 66%, #F6AD55 100%)';
    }
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
                    <div className="ms-5 ps-3">
                      <h3 className="mb-2 fw-bold">{userDetails.name}</h3>
                      <div className="d-flex flex-wrap gap-3">
                        <span className="text-muted">
                          <i className="fas fa-user-tag me-1"></i>
                          {userDetails.role}
                        </span>
                        <span className="text-muted">•</span>
                        <span className="text-muted">
                          <i className="fas fa-id-card me-1"></i>
                          {userDetails.aadhar_number}
                        </span>
                      </div>
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
                            <div className="text-muted small mb-1">Name:</div>
                            <div className="fs-5">{userDetails.name}</div>
                          </div>

                          <div className="mb-4">
                            <div className="text-muted small mb-1">Email:</div>
                            <div className="fs-5">
                              {userDetails.email || "Not provided"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-muted small mb-1">Mobile:</div>
                            <div className="fs-5">
                              {userDetails.mobile_number}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-muted small mb-1">
                              Aadhar Number:
                            </div>
                            <div className="fs-5">
                              {userDetails.aadhar_number}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-muted small mb-1">Role:</div>
                            <div className="fs-5">{userDetails.role}</div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="px-2">
                          <div className="mb-4">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="name"
                              value={formData.name || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              name="email"
                              value={formData.email || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label">Mobile Number</label>
                            <input
                              type="tel"
                              className="form-control form-control-lg"
                              name="mobile_number"
                              value={formData.mobile_number || ""}
                              onChange={handleInputChange}
                              placeholder="Enter mobile number"
                              disabled
                            />
                            <small className="text-muted">
                              Mobile number cannot be changed as it's used for
                              login.
                            </small>
                          </div>

                          <div className="mb-4">
                            <label className="form-label">Aadhar Number</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="aadhar_number"
                              value={formData.aadhar_number || ""}
                              onChange={handleInputChange}
                              placeholder="Enter your aadhar number"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label">Role</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              value={formData.role || ""}
                              onChange={handleInputChange}
                            />
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
                  <div className="card h-100 shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title text-uppercase mb-4 fw-bold">
                        <i className="fas fa-id-card me-2 text-primary"></i>
                        OUTLET DETAILS
                      </h5>

                      <div className="ps-2">
                        {/* <div className="mb-4">
                          <div className="text-muted small mb-1">User ID:</div>
                          <div className="fs-5">{userDetails.user_id}</div>
                        </div> */}

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Outlet Name:
                          </div>
                          <div className="fs-5">
                            {userDetails.subscription_outlet[0]?.outlet_name ||
                              "Not available"}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Subscription Plan:
                          </div>
                          <div className="fs-5">
                            {userDetails.subscription_outlet[0]
                              ?.subscription_name || "Not available"}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Subscription Status:
                          </div>
                          <div className="fs-5">
                            <span
                              className={`badge bg-${
                                userDetails.subscription_outlet[0]
                                  ?.days_until_expiry > 30
                                  ? "success"
                                  : "warning"
                              }`}
                            >
                              {userDetails.subscription_outlet[0]
                                ?.days_until_expiry > 30
                                ? "Active"
                                : "Expiring Soon"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Subscription Period:
                          </div>
                          <div className="fs-5">
                            {
                              userDetails.subscription_outlet[0]
                                ?.subscription_date
                            }{" "}
                            to {userDetails.subscription_outlet[0]?.expiry_date}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Days Until Expiry:
                          </div>
                          <div className="fs-5">
                            {userDetails.subscription_outlet[0]
                              ?.days_until_expiry || "0"}{" "}
                            days
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Last Login:
                          </div>
                          <div className="fs-5">
                            {userDetails.last_login || "Not available"}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-muted small mb-1">
                            Account Created:
                          </div>
                          <div className="fs-5">
                            {userDetails.created_on || "Not available"}
                          </div>
                        </div>

                        {/* <div className="mb-4">
                          <div className="text-muted small mb-1">Created By:</div>
                          <div className="fs-5">{userDetails.created_by || 'Not available'}</div>
                        </div> */}
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