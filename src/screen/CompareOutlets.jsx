import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import VerticalSidebar from '../components/VerticalSidebar'

const CompareOutlets = () => {
  return (
   

    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row mb-4">
              <div className="col-12 text-center">
                <h2 className="fw-bold">All Outlet List</h2>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div className="d-flex gap-2 flex-wrap">
                  <label className="btn btn-outline-primary">
                    <input type="checkbox" className="form-check-input me-1" />
                     Starbuck
                  </label>
                  <label className="btn btn-outline-success">
                    <input type="checkbox" className="form-check-input me-1" />
                    KFC
                  </label>
                  <label className="btn btn-outline-danger">
                    <input type="checkbox" className="form-check-input me-1" />
                    McDonalds
                  </label>
                  <label className="btn btn-outline-warning">
                    <input type="checkbox" className="form-check-input me-1" />
                    Burger King
                  </label>
                </div>
              </div>
            </div>
            
            <div className="row mt-4 mb-4">
              <div className="col-12 text-center">
                <button type="button" className="btn btn-primary btn-lg">
                  <i className="fas fa-chart-bar me-2"></i>
                  Compare Selected Outlets
                </button>
              </div>
            </div>
            
            <Footer/>
          </div>

        </div>
      </div>
    </div>
      
     
   
    
  )
}

export default CompareOutlets