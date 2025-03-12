import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the images at the top of the file
import tree3 from '../assets/img/illustrations/tree-3.png';
import authMaskLight from '../assets/img/illustrations/auth-basic-mask-light.png';
import tree from '../assets/img/illustrations/tree.png';
// Import the auth CSS
import '../assets/css/page-auth.css';
import logo from "../assets/img/company/MenuMitra_logo.png";

function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      // Here you would typically make an API call to send OTP
      console.log('Sending OTP to:', mobileNumber);
      setShowOtpForm(true);
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

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    // For now, we're using 1234 as the hardcoded OTP
    if (enteredOtp === '1234') {
      navigate('/dashboard');
    } else {
      alert('Invalid OTP! (Hint: Use 1234)');
    }
  };

  const handleBack = () => {
    setShowOtpForm(false);
    setOtp(['', '', '', '']);
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
                  <img src={logo} alt="MenuMitra Logo" style={{ width: "60px", height: "60px" }} />
                </span>
              </span>
              <span className="app-brand-text demo text-heading fw-bold">MenuMitra</span>
            </div>
          </div>

          <div className="card-body mt-1">
            {!showOtpForm ? (
              <>
                <h4 className="mb-2 text-center fs-5">Welcome to MenuMitra Statistics Dashboard</h4>
                <p className="mb-4 text-center">Please enter your mobile number to login</p>

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
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) setMobileNumber(value);
                      }}
                      autoFocus
                      maxLength={10}
                      required
                    />
                    <label htmlFor="mobile">Mobile Number</label>
                  </div>

                  <div className="mb-3">
                    <button 
                      className="btn btn-primary d-grid w-100" 
                      type="submit"
                      disabled={mobileNumber.length !== 10}
                    >
                      Send OTP
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
                <div className="d-flex justify-content-center gap-2">
            <a
              href="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg"
              className="btn btn-icon btn-lg rounded-pill btn-text-facebook waves-effect waves-light"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-facebook" />
            </a>
            <a
              href="https://www.linkedin.com/company/102429337/admin/dashboard/"
              className="btn btn-icon btn-lg rounded-pill btn-text-linkedin waves-effect waves-light"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin" />
            </a>
            <a
              href="https://www.youtube.com/@menumitra"
              className="btn btn-icon btn-lg rounded-pill btn-text-youtube waves-effect waves-light"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-youtube" />
            </a>
            <a
              href="https://t.me/MenuMitra"
              className="btn btn-icon btn-lg rounded-pill btn-text-telegram waves-effect waves-light"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-telegram" />
            </a>
            <a
              href="https://www.instagram.com/menumitra/"
              className="btn btn-icon btn-lg rounded-pill btn-text-instagram waves-effect waves-light"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-instagram" />
            </a>
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
                <p className="mb-4 text-center">Please enter the OTP sent to {mobileNumber}</p>

                <form onSubmit={handleVerifyOtp}>
                  <div className="d-flex gap-2 justify-content-center mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        className="form-control text-center"
                        style={{ width: '60px', height: '60px', fontSize: '24px' }}
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        required
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  <div className="mb-3 d-flex justify-content-center">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={otp.some(digit => !digit)}
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-0">Didn't receive OTP?</p>
                  <button 
                    className="btn btn-text-primary waves-effect waves-light p-0" 
                    onClick={() => {
                      console.log('Resending OTP to:', mobileNumber);
                      // Add your resend OTP logic here
                    }}
                  >
                    Resend OTP
                  </button>
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