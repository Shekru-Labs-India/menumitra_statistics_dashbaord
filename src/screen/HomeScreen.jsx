import React from 'react'
import VerticalSidebar from '../components/VerticalSidebar'
import Header from '../components/Header';

function HomeScreen() {
  return (
    <>
          <VerticalSidebar />
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
    <Header/>
          {/* Menu */}
          {/* / Menu */}

          {/* Layout container */}
          <div className="layout-page">
            <div className="content-wrapper">
              {/* Content */}
              <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="py-3 mb-4">
                  <span className="text-muted fw-light">Home /</span> Dashboard
                </h4>

                {/* Content goes here */}
              </div>
              {/* / Content */}
            </div>
          </div>
          {/* / Layout container */}
        </div>
      </div>
    </>
  );
}

export default HomeScreen