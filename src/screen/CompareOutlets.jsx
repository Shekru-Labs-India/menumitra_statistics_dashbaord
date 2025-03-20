import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import VerticalSidebar from '../components/VerticalSidebar'

const CompareOutlets = () => {
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  const handleCompare = () => {
    setShowComparisonTable(true);
  };

  return (
   

    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row mb-3 mb-md-4">
              <div className="col-12 text-center text-md-start">
                <h2 className="fw-bold fs-2">All Outlet List</h2>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                     Starbuck
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    KFC
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    McDonalds
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    Burger King
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    Pizza Hut
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    Domino's
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    Subway
                  </label>
                  <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                    <input type="checkbox" className="form-check-input me-1" />
                    Dunkin'
                  </label>
                </div>
              </div>
            </div>
            
            <div className="row mt-3 mt-md-4 mb-4">
              <div className="col-12 text-center text-md-start">
                <button 
                  type="button" 
                  className="btn btn-primary btn-md btn-lg-lg"
                  onClick={handleCompare}
                >
                  <i className="fas fa-chart-bar me-1 me-md-2"></i>
                  <span className="d-inline">Compare</span>
                </button>
              </div>
            </div>

            {showComparisonTable && (
              <div className="row mb-4">
                <div className="col-12">
                  <h2 className="fw-bold">Comparison Results</h2>
                
                  {/* Outlets Comparison Table */}
                  <div className="card">
                    <div className="card-datatable table-responsive">
                      <div
                        id="DataTables_Table_0_wrapper"
                        className="dataTables_wrapper dt-bootstrap5 no-footer"
                      >
                        <table
                          className="datatables-users table dataTable no-footer dtr-column"
                          id="DataTables_Table_0"
                        >
                          <thead>
                            <tr>
                              <th
                                className="control sorting_disabled dtr-hidden"
                                style={{ width: 0, display: "none" }}
                              />
                              <th className="text-center" style={{ width: "40px" }}>
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="selectAll"
                                  />
                                </div>
                              </th>
                              <th className="sorting sorting_desc" style={{ minWidth: "180px" }}>
                                OUTLET NAME
                              </th>
                              <th className="sorting" style={{ minWidth: "120px" }}>
                                NO OF WAITERS
                              </th>
                              <th className="sorting" style={{ minWidth: "150px" }}>
                                AVG ORDER<br />PER WEEK
                              </th>
                              <th className="sorting" style={{ minWidth: "120px" }}>
                                MOST<br />POPULAR ITEM
                              </th>
                              <th className="sorting" style={{ minWidth: "120px" }}>
                                LEAST<br />POPULAR ITEM
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="odd">
                              <td
                                className="control"
                                tabIndex={0}
                                style={{ display: "none" }}
                              />
                              <td className="text-center">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="checkbox1"
                                  />
                                </div>
                              </td>
                              <td className="sorting_1">
                                <div className="d-flex justify-content-start align-items-center">
                                  <div className="avatar-wrapper">
                                    <div className="avatar avatar-sm me-3">
                                      <span className="avatar-initial rounded-circle bg-label-primary">
                                        <i className="fas fa-store"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <span className="fw-medium">Jagdamba</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="fw-medium">12</span>
                              </td>
                              <td>
                                <span className="fw-medium">₹ 86,540</span>
                              </td>
                              <td>
                                <div>
                                  <p className="fw-medium mb-0">Butter Chicken</p>
                                  <small className="text-muted">248 orders</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <p className="fw-medium mb-0">Vegetable Soup</p>
                                  <small className="text-muted">24 orders</small>
                                </div>
                              </td>
                            </tr>
                            <tr className="even">
                              <td
                                className="control"
                                tabIndex={0}
                                style={{ display: "none" }}
                              />
                              <td className="text-center">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="checkbox2"
                                  />
                                </div>
                              </td>
                              <td className="sorting_1">
                                <div className="d-flex justify-content-start align-items-center">
                                  <div className="avatar-wrapper">
                                    <div className="avatar avatar-sm me-3">
                                      <span className="avatar-initial rounded-circle bg-label-success">
                                        <i className="fas fa-store"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <span className="fw-medium">Gokul veg</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="fw-medium">8</span>
                              </td>
                              <td>
                                <span className="fw-medium">₹ 62,180</span>
                              </td>
                              <td>
                                <div>
                                  <p className="fw-medium mb-0">Masala Dosa</p>
                                  <small className="text-muted">186 orders</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <p className="fw-medium mb-0">Fruit Salad</p>
                                  <small className="text-muted">31 orders</small>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Footer/>
          </div>

        </div>
      </div>
    </div>
      
     
   
    
  )
}

export default CompareOutlets