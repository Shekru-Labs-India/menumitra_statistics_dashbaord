import React from "react";
import Header from "../components/Header";
import VerticalSidebar from "../components/VerticalSidebar";
// import { useTheme } from "../context/ThemeContext";

function Settings() {
//   const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="layout-container">
      <VerticalSidebar />
      <div className="layout-page d-flex flex-column min-vh-100">
        <Header />
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="card mb-4">
            <h5 className="card-header">Display Settings</h5>
            <div className="card-body">
              <div className="d-flex align-items-start align-items-sm-center gap-4">
                <div className="flex-grow-1">
                  <h6 className="mb-2">Theme Mode</h6>
                  <div className="d-flex align-items-center">
                    <div className="form-check form-switch me-3">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        id="themeSwitch"
                       
                      />
                      <label
                        className="form-check-label cursor-pointer"
                        htmlFor="themeSwitch"
                      >
                       
                      </label>
                    </div>
                  </div>
                  <p className="text-muted mt-2 mb-0">
                    Choose between light or dark theme. Dark theme helps reduce
                    eye strain in low-light conditions.
                  </p>
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
