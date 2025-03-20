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
          <div className="container-fluid flex-grow-1 container-p-y">
        <div className="row mb-4">
        
          <div className="col-12">
            <h2 className="fw-bold">All Outlets lists</h2>
          </div>
        </div>
        
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
                    <th className="sorting" style={{ minWidth: "150px" }}>
                      LOCATION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Outlet 1 */}
                  <tr className="odd">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox1" />
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
                          <span className="fw-medium">Jagdamba Restaurant</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Andheri East, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 2 */}
                  <tr className="even">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox2" />
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
                          <span className="fw-medium">Gokul Veg</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Bandra West, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 3 */}
                  <tr className="odd">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox3" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-danger">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Spice Paradise</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Juhu, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 4 */}
                  <tr className="even">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox4" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-info">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Royal Bistro</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Powai, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 5 */}
                  <tr className="odd">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox5" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-warning">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Taj Flavors</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Malad West, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 6 */}
                  <tr className="even">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox6" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-secondary">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Green Garden</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Thane, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 7 */}
                  <tr className="odd">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox7" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-dark">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Curry House</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Vashi, Navi Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 8 */}
                  <tr className="even">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox8" />
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
                          <span className="fw-medium">Tandoor Express</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Belapur, Navi Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 9 */}
                  <tr className="odd">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox9" />
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
                          <span className="fw-medium">Café Delight</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Dadar, Mumbai</span>
                    </td>
                  </tr>

                  {/* Outlet 10 */}
                  <tr className="even">
                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                    <td className="text-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkbox10" />
                      </div>
                    </td>
                    <td className="sorting_1">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded-circle bg-label-danger">
                              <i className="fas fa-store"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">Spicy Corner</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">Chembur, Mumbai</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Compare button */}
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