import React from "react";
import Header from "../components/Header";
import VerticalSidebar from "../components/VerticalSidebar";
import { useTheme } from "../components/ThemeContext";

function Settings() {
  // Use the theme context
  const { theme, setTheme } = useTheme();

  // Handler functions for theme buttons
  const handleLightModeClick = () => {
    setTheme('light');
  };

  const handleDarkModeClick = () => {
    setTheme('dark');
  };
  
  const handleSystemModeClick = () => {
    setTheme('system');
  };

  return (
    <div className="layout-container">
      <VerticalSidebar />
      <div className="layout-page d-flex flex-column min-vh-100">
        <Header />
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="py-3 mb-4">Settings</h4>
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Theme Settings</h5>
                  </div>
                  <div className="card-body">
                    <p>Choose your preferred theme for the dashboard.</p>
                    
                    <div className="d-flex flex-column gap-3 mt-4" style={{ maxWidth: '300px' }}>
                      {/* Light theme option */}
                      <div 
                        className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'light' ? 'bg-light border' : ''}`}
                        onClick={handleLightModeClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="me-3 fs-3">
                          <i className="bx bx-sun"></i>
                        </div>
                        <span className="fs-5">Light</span>
                      </div>
                      
                      {/* Dark theme option */}
                      <div 
                        className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'dark' ? 'bg-light border' : ''}`}
                        onClick={handleDarkModeClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="me-3 fs-3">
                          <i className="bx bx-moon"></i>
                        </div>
                        <span className="fs-5">Dark</span>
                      </div>
                      
                      {/* System theme option */}
                      <div 
                        className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'system' ? 'bg-light border' : ''}`}
                        onClick={handleSystemModeClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="me-3 fs-3">
                          <i className="bx bx-desktop"></i>
                        </div>
                        <span className="fs-5">System</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p><strong>Current Theme:</strong> {theme.charAt(0).toUpperCase() + theme.slice(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
