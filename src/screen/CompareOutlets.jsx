import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import VerticalSidebar from '../components/VerticalSidebar'

const CompareOutlets = () => {
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [isOutletListExpanded, setIsOutletListExpanded] = useState(true);
  const [selectedOutlets, setSelectedOutlets] = useState({
    selectAll: false,
    starbuck: false,
    kfc: false,
    mcdonalds: false,
    burgerKing: false,
    pizzaHut: false,
    dominos: false,
    subway: false,
    dunkin: false
  });

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    setSelectedOutlets(prev => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = checked;
      });
      return newState;
    });
  };

  const handleOutletSelect = (outlet) => {
    setSelectedOutlets(prev => ({
      ...prev,
      [outlet]: !prev[outlet],
      selectAll: false
    }));
  };

  const handleCompare = () => {
    setShowComparisonTable(true);
    setIsOutletListExpanded(false);
  };

  const toggleOutletList = () => {
    setIsOutletListExpanded(!isOutletListExpanded);
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page d-flex flex-column min-vh-100">
          <Header />
          
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Collapsible Outlet List Section */}
            <div className="card mb-4">
              <div 
                className="card-header cursor-pointer d-flex justify-content-between align-items-center p-3"
                onClick={toggleOutletList}
              >
                <h5 className="mb-0">
                  <i className="fas fa-store me-2"></i>
                  All Outlet List
                </h5>
                <button className="btn btn-icon btn-sm">
                  <i className={`fas fa-chevron-${isOutletListExpanded ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {isOutletListExpanded && (
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.selectAll}
                        onChange={handleSelectAll}
                      />
                      All
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.starbuck}
                        onChange={() => handleOutletSelect('starbuck')}
                      />
                      Starbuck
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.kfc}
                        onChange={() => handleOutletSelect('kfc')}
                      />
                      KFC
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.mcdonalds}
                        onChange={() => handleOutletSelect('mcdonalds')}
                      />
                      McDonalds
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.burgerKing}
                        onChange={() => handleOutletSelect('burgerKing')}
                      />
                      Burger King
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.pizzaHut}
                        onChange={() => handleOutletSelect('pizzaHut')}
                      />
                      Pizza Hut
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.dominos}
                        onChange={() => handleOutletSelect('dominos')}
                      />
                      Domino's
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.subway}
                        onChange={() => handleOutletSelect('subway')}
                      />
                      Subway
                    </label>
                    <label className="btn btn-outline-dark btn-sm btn-md-normal mb-2">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-1"
                        checked={selectedOutlets.dunkin}
                        onChange={() => handleOutletSelect('dunkin')}
                      />
                      Dunkin'
                    </label>
                  </div>
                  
                  <div className="text-center text-md-start mt-3">
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
              )}
            </div>

            {/* Comparison Table Section */}
            {showComparisonTable && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-chart-bar me-2"></i>
                    Comparison Results
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>OUTLET NAME</th>
                          <th>NO OF WAITERS</th>
                          <th>AVG ORDER<br />PER WEEK</th>
                          <th>MOST<br />POPULAR ITEM</th>
                          <th>LEAST<br />POPULAR ITEM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar-initial rounded-circle bg-label-primary me-2">
                                <i className="fas fa-store"></i>
                              </span>
                              <span>Jagdamba</span>
                            </div>
                          </td>
                          <td>12</td>
                          <td>₹ 86,540</td>
                          <td>
                            <div>
                              <p className="mb-0">Butter Chicken</p>
                              <small className="text-muted">248 orders</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p className="mb-0">Vegetable Soup</p>
                              <small className="text-muted">24 orders</small>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar-initial rounded-circle bg-label-success me-2">
                                <i className="fas fa-store"></i>
                              </span>
                              <span>Gokul Veg</span>
                            </div>
                          </td>
                          <td>8</td>
                          <td>₹ 62,180</td>
                          <td>
                            <div>
                              <p className="mb-0">Masala Dosa</p>
                              <small className="text-muted">186 orders</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p className="mb-0">Fruit Salad</p>
                              <small className="text-muted">31 orders</small>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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