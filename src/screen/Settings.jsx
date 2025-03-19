import React from "react";
import Header from "../components/Header";
import VerticalSidebar from "../components/VerticalSidebar";
import { useTheme } from "../components/ThemeContext";

function Settings() {
  // Use the theme context
  const { theme, setTheme, isLightMode } = useTheme();

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
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Account /</span> Settings
            </h4>
            
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Theme Settings</h5>
                    <div className="card-subtitle text-muted">Personalize your dashboard appearance</div>
                  </div>
                  
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="mb-3">Choose your theme preference</h6>
                        <p className="text-muted mb-4">Select how you want MenuMitra to appear. You can choose light, dark, or match your system settings.</p>
                        
                        <div className="d-flex flex-column gap-3 mb-4" style={{ maxWidth: '300px' }}>
                          {/* Light theme option */}
                          <div 
                            className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'light' ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light-lighter'}`}
                            onClick={handleLightModeClick}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className={`me-3 fs-3 ${theme === 'light' ? 'text-primary' : ''}`}>
                              <i className="bx bx-sun"></i>
                            </div>
                            <div>
                              <span className={`fs-5 ${theme === 'light' ? 'text-primary fw-semibold' : ''}`}>Light</span>
                              <p className="text-muted mb-0 small">Best for daytime viewing</p>
                            </div>
                            {theme === 'light' && (
                              <div className="ms-auto text-primary">
                                <i className="bx bx-check fs-4"></i>
                              </div>
                            )}
                          </div>
                          
                          {/* Dark theme option */}
                          <div 
                            className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'dark' ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light-lighter'}`}
                            onClick={handleDarkModeClick}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className={`me-3 fs-3 ${theme === 'dark' ? 'text-primary' : ''}`}>
                              <i className="bx bx-moon"></i>
                            </div>
                            <div>
                              <span className={`fs-5 ${theme === 'dark' ? 'text-primary fw-semibold' : ''}`}>Dark</span>
                              <p className="text-muted mb-0 small">Reduced glare for night use</p>
                            </div>
                            {theme === 'dark' && (
                              <div className="ms-auto text-primary">
                                <i className="bx bx-check fs-4"></i>
                              </div>
                            )}
                          </div>
                          
                          {/* System theme option */}
                          <div 
                            className={`d-flex align-items-center p-3 rounded cursor-pointer ${theme === 'system' ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light-lighter'}`}
                            onClick={handleSystemModeClick}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className={`me-3 fs-3 ${theme === 'system' ? 'text-primary' : ''}`}>
                              <i className="bx bx-desktop"></i>
                            </div>
                            <div>
                              <span className={`fs-5 ${theme === 'system' ? 'text-primary fw-semibold' : ''}`}>System</span>
                              <p className="text-muted mb-0 small">Follows your device settings</p>
                            </div>
                            {theme === 'system' && (
                              <div className="ms-auto text-primary">
                                <i className="bx bx-check fs-4"></i>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 alert alert-primary alert-dismissible" role="alert">
                          <div className="d-flex">
                            <i className="bx bx-info-circle me-2 fs-4"></i>
                            <div>
                              <h6 className="alert-heading mb-1">Active Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</h6>
                              <span>
                                {theme === 'system' ? 
                                  `Currently using ${isLightMode ? 'light' : 'dark'} mode based on your system settings` : 
                                  `Your dashboard is in ${theme} mode`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <h6 className="mb-3">Theme Features</h6>
                        <div className="card bg-lighter shadow-none">
                          <div className="card-body">
                            <h6 className="mb-3">Light Mode</h6>
                            <ul className="ps-3 mb-4">
                              <li>Enhanced readability in bright environments</li>
                              <li>Standard UI familiar to most users</li>
                              <li>Optimized for daytime use</li>
                              <li>Reduced battery usage on LCD screens</li>
                            </ul>
                            
                            <h6 className="mb-3">Dark Mode</h6>
                            <ul className="ps-3 mb-4">
                              <li>Reduced eye strain in low-light environments</li>
                              <li>Lower power consumption on OLED displays</li>
                              <li>Modern, sleek aesthetic</li>
                              <li>Better focus on content and data</li>
                            </ul>
                            
                            <h6 className="mb-3">System Mode</h6>
                            <ul className="ps-3">
                              <li>Automatically matches your device theme</li>
                              <li>Adapts to time of day if set up in your OS</li>
                              <li>Maintains consistency with other applications</li>
                            </ul>
                          </div>
                        </div>
                      </div>
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
