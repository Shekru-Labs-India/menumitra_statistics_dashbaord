import React, { useState } from "react";
import Header from "../components/Header";
import VerticalSidebar from "../components/VerticalSidebar";

function Settings() {
  // Use local state for theme toggle instead of useTheme hook
  const [isLightMode, setIsLightMode] = useState(true);

  // Handlers for theme toggle buttons
  const handleLightModeClick = () => {
    setIsLightMode(true);
  };

  const handleDarkModeClick = () => {
    setIsLightMode(false);
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
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Theme Settings</h5>
                    <div className="theme-switcher">
                      <button 
                        className={`btn btn-icon ${isLightMode ? 'btn-primary' : 'btn-outline-secondary'} me-2`}
                        onClick={handleLightModeClick}
                        title="Light Mode"
                      >
                        <i className="fas fa-sun"></i>
                      </button>
                      <button 
                        className={`btn btn-icon ${!isLightMode ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={handleDarkModeClick}
                        title="Dark Mode"
                      >
                        <i className="fas fa-moon"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-0">
                      {!isLightMode 
                        ? "Dark mode is currently active. The interface uses a dark color scheme for better visibility in low-light conditions."
                        : "Light mode is currently active. The interface uses a light color scheme for better visibility in bright conditions."}
                    </p>
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
