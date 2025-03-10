import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div 
      className="position-relative"
      style={{
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div 
        className="authentication-wrapper authentication-basic"
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}
      >
        <div 
          className="authentication-inner py-4"
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto'
          }}
        >
          <div className="card">
            <div className="card-body">
              {/* Logo */}
              <div className="app-brand justify-content-center mb-4 mt-2">
                <span className="app-brand-logo demo">
                  <span style={{ color: "var(--bs-primary)" }}>
                    <svg width="30" height="24" viewBox="0 0 250 196" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.3002 1.25469L56.655 28.6432C59.0349 30.1128 60.4839 32.711 60.4839 35.5089V160.63C60.4839 163.468 58.9941 166.097 56.5603 167.553L12.2055 194.107C8.3836 196.395 3.43136 195.15 1.14435 191.327C0.395485 190.075 0 188.643 0 187.184V8.12039C0 3.66447 3.61061 0.0522461 8.06452 0.0522461C9.56056 0.0522461 11.0271 0.468577 12.3002 1.25469Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M237.721 1.18923L125 70.3075V136.87L250 65.2465V8.06814C250 3.61223 246.389 0 241.935 0C240.448 0 238.99 0.411583 237.721 1.18923Z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span className="app-brand-text demo text-heading fw-bold">Materio</span>
              </div>

              {!showOtpForm ? (
                <>
                  <h4 className="mb-2">Welcome to Materio! 👋</h4>
                  <p className="mb-4">Please enter your mobile number to login</p>

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

                  <p className="text-center">
                    <span>New on our platform?</span>
                    <a href="/register">
                      <span> Create an account</span>
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-2">
                    <button 
                      className="btn btn-icon btn-text-secondary rounded-pill btn-sm me-2"
                      onClick={handleBack}
                      type="button"
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <h4 className="mb-0">Verify OTP</h4>
                  </div>
                  <p className="mb-4">Please enter the OTP sent to {mobileNumber}</p>

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

                    <div className="mb-3">
                      <button 
                        type="submit" 
                        className="btn btn-primary d-grid w-100"
                        disabled={otp.some(digit => !digit)}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </form>

                  <div className="text-center">
                    <p className="mb-0">Didn't receive OTP?</p>
                    <button 
                      className="btn btn-link p-0" 
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
        </div>
      </div>
    </div>
  );
}

export default LoginScreen; 