import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
// Import the images at the top of the file
import tree3 from '../assets/img/illustrations/tree-3.png';
import authMaskLight from '../assets/img/illustrations/auth-basic-mask-light.png';
import tree from '../assets/img/illustrations/tree.png';
// Import the auth CSS
import '../assets/css/page-auth.css';
import logo from "../assets/img/company/MenuMitra_logo.png";
// Import configuration
import { menuMitraCompanyInfo, menuMitraSocialLinks, menuMitraAppInfo, apiEndpoint } from '../config/menuMitraConfig';
import { requestNotificationPermission } from '../config/firebase';

function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(15);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
  localStorage.removeItem('outlet_id');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('mobile_number');
  localStorage.removeItem('role');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('fcm_token');

  }, []);



  // Start countdown timer when OTP form is shown
  useEffect(() => {
    let timer;
    if (showOtpForm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [showOtpForm, countdown]);

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      setIsLoading(true);
      setError('');
      
      try {
        // Make API call to send OTP
        const response = await axios.post(`${apiEndpoint}outlet_login`, {
          mobile: mobileNumber
        });
        
        // Check if response is successful
        if (response.status === 200) {
          console.log('API Response:', response.data);
          
          // Check role from response
          const { role } = response.data;
          
          // Only proceed if role is owner, manager, or captain
          if (role === 'owner' || role === 'manager' || role === 'captain') {
            setShowOtpForm(true);
            setCountdown(15);
            setResendDisabled(true);
          } else {
            // Show error if role is not allowed
            setError('Please login with a registered number. Only owner, manager, or captain can access this dashboard.');
          }
        }
      } catch (error) {
        console.error('API Error:', error);
        setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const enteredOtp = otp.join('');
    
    try {
      // Get FCM token 
      let fcmToken;
      try {
        fcmToken = await requestNotificationPermission();
        if (!fcmToken) {
          throw new Error('Failed to get notification token');
        }
        localStorage.setItem('fcm_token', fcmToken);
      } catch (tokenError) {
        console.error('FCM Token Error:', tokenError);
        setError('Please allow notifications to continue. You can change this in your browser settings.');
        setIsLoading(false);
        return;
      }

      // Make API call to verify OTP with FCM token
      const response = await axios.post(`${apiEndpoint}verify_otp`, {
        mobile: mobileNumber,
        otp: parseInt(enteredOtp),
        fcm_token: fcmToken
      });
      
      // Check if response is successful
      if (response.status === 200) {
        console.log('Verification Response:', response.data);
        
        // Extract data from response based on updated API format
        const { user_id, name, outlet_id, role, refresh, access } = response.data;
        
        // Store data in localStorage
        localStorage.setItem('outlet_id', outlet_id);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('user_name', name);
        localStorage.setItem('mobile_number', mobileNumber);
        localStorage.setItem('role', role || "owner");
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('access', access);
        
        // Add timestamp to track when token was saved
        localStorage.setItem('token_timestamp', Date.now().toString());
        
        // Navigate to dashboard after a small delay for better UX
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setIsLoading(false);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        setError(error.response.data.message || 'Invalid OTP. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request
        setError('Error verifying OTP. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setShowOtpForm(false);
    setOtp(['', '', '', '']);
    setError('');
  };

  const handleResendOtp = async () => {
    setOtp(['', '', '', '']);
    setIsLoading(true);
    setError('');
    
    try {
      // Make API call to resend OTP
      const response = await axios.post(`${apiEndpoint}outlet_login`, {
        mobile: mobileNumber
      });
      
      // Check if response is successful
      if (response.status === 200) {
        console.log('API Response (Resend):', response.data);
        setCountdown(15);
        setResendDisabled(true);
      }
    } catch (error) {
      console.error('API Error (Resend):', error);
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authentication-wrapper authentication-basic container-p-y">
      <div className="authentication-inner">
        {/* Login */}
        <div className="card">
          {/* Logo */}
          <div className="app-brand justify-content-center mt-5">
            <div className="d-flex flex-column align-items-center">
              <span className="app-brand-logo demo mb-2">
                <span style={{ color: "var(--bs-primary)" }}>
                  <img
                    src={logo}
                    alt={`${menuMitraAppInfo.name} Logo`}
                    style={{
                      width: menuMitraAppInfo.logo.width,
                      height: menuMitraAppInfo.logo.height,
                    }}
                  />
                </span>
              </span>
              <span className="app-brand-text demo text-heading fw-bold">
                {menuMitraAppInfo.name}
              </span>
            </div>
          </div>

          <div className="card-body mt-1">
            {!showOtpForm ? (
              <>
                <h4 className="mb-2 text-center fs-5">
                  Welcome to {menuMitraAppInfo.title}
                </h4>
                <p className="mb-4 text-center">
                  Please enter your mobile number to login
                </p>

                <form className="mb-3" onSubmit={handleMobileSubmit}>
                  <div className="form-floating form-floating-outline mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) setMobileNumber(value);
                      }}
                      autoFocus
                      maxLength={10}
                      required
                      disabled={isLoading}
                    />
                    <label htmlFor="mobile">Mobile Number</label>
                  </div>

                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <button
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      disabled={mobileNumber.length !== 10 || isLoading}
                    >
                      {isLoading ? (
                        <span>
                          <i className="fas fa-circle-notch fa-spin me-2"></i>
                          Sending OTP...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </form>
                {/* 
                <p className="text-center">
                  <span>New on our platform?</span>
                  <a href="/register">
                    <span> Create an account</span>
                  </a>
                </p> */}

                <div className="text-center">
                  <p className="text-muted mb-0">
                    <small>
                      <span>
                        <i className="fa-solid fa-bolt text-primary me-1"></i>{" "}
                        Powered by
                      </span>
                      <br />
                      <Link
                        to={menuMitraCompanyInfo.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="text-primary">
                          {menuMitraCompanyInfo.name}
                        </span>
                        <br />
                      </Link>
                      {/* <span className="text-muted">version {menuMitraCompanyInfo.version}</span> */}
                    </small>
                  </p>
                </div>
                <div className="mt-4 d-flex justify-content-center gap-2">
                  {menuMitraSocialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`btn btn-outline-secondary btn-icon btn-lg rounded-pill ${social.btnClass} waves-effect waves-light`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className={social.icon} />
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <button
                    className="btn btn-icon btn-text-secondary rounded-pill btn-sm me-2"
                    onClick={handleBack}
                    type="button"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h4 className="mb-0">Verify OTP</h4>
                </div>
                <p className="mb-4 text-center">
                  Please enter the OTP sent to <b>{mobileNumber}</b>
                </p>

                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp}>
                  <div className="d-flex gap-2 justify-content-center mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        className="form-control text-center"
                        style={{
                          width: "60px",
                          height: "60px",
                          fontSize: "24px",
                        }}
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        required
                        autoFocus={index === 0}
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <div className="mb-3 d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={otp.some((digit) => !digit) || isLoading}
                    >
                      {isLoading ? (
                        <span>
                          <i className="fas fa-circle-notch fa-spin me-2"></i>
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-0">Didn't receive OTP?</p>
                  <button
                    className="btn btn-text-primary waves-effect waves-light p-0"
                    onClick={handleResendOtp}
                    disabled={resendDisabled || isLoading}
                  >
                    {isLoading && !resendDisabled ? (
                      <span>
                        <i className="fas fa-circle-notch fa-spin me-2"></i>
                        Resending OTP...
                      </span>
                    ) : resendDisabled ? (
                      `Resend OTP in ${countdown}s`
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    <small>
                      <span>
                        <i className="fa-solid fa-bolt text-primary me-1"></i>{" "}
                        Powered by
                      </span>
                      <br />
                      <Link
                        to={menuMitraCompanyInfo.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="text-primary">
                          {menuMitraCompanyInfo.name}
                        </span>
                        <br />
                      </Link>
                      {/* <span className="text-muted">version {menuMitraCompanyInfo.version}</span> */}
                    </small>
                  </p>
                </div>
                <div className="mt-4 d-flex justify-content-center gap-2">
                  {menuMitraSocialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`btn btn-outline-secondary btn-icon btn-lg rounded-pill ${social.btnClass} waves-effect waves-light`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className={social.icon} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* /Login */}
      </div>

      {/* Decorative illustrations */}
      <img
        src={tree3}
        alt="auth-tree"
        className="authentication-image-object-left d-none d-lg-block"
      />
      <img
        src={authMaskLight}
        className="authentication-image d-none d-lg-block"
        height="172"
        alt="triangle-bg"
        data-app-light-img="illustrations/auth-basic-mask-light.png"
        data-app-dark-img="illustrations/auth-basic-mask-dark.png"
      />
      <img
        src={tree}
        alt="auth-tree"
        className="authentication-image-object-right d-none d-lg-block"
      />
    </div>
  );
}

export default LoginScreen; 