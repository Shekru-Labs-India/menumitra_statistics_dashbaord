import React from "react";
import Header from "../components/Header";
import VerticalSidebar from "../components/VerticalSidebar";


function Settings() {
  const { isDarkMode, setTheme } = useTheme();

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
                        className={`btn btn-icon ${!isDarkMode ? 'btn-primary' : 'btn-outline-secondary'} me-2`}
                        onClick={() => setTheme('light')}
                        title="Light Mode"
                      >
                        <i className="fas fa-sun"></i>
                      </button>
                      <button 
                        className={`btn btn-icon ${isDarkMode ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setTheme('dark')}
                        title="Dark Mode"
                      >
                        <i className="fas fa-moon"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-0">
                      {isDarkMode 
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
