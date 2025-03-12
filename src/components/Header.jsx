import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/img/avatars/1.png'
import 'animate.css'
import AnimationSelect from './AnimationSelect'

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState('animate__fadeIn animate__faster');
  const [exitAnimation, setExitAnimation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if menu is collapsed on initial load
    if (window.Helpers) {
      setIsMenuCollapsed(window.Helpers.isCollapsed());
    }
    
    // Listen for menu state changes
    const handleMenuToggle = () => {
      if (window.Helpers) {
        setIsMenuCollapsed(window.Helpers.isCollapsed());
      }
    };
    
    // Add listener for custom event
    window.addEventListener('layout:toggle', handleMenuToggle);
    
    return () => {
      window.removeEventListener('layout:toggle', handleMenuToggle);
    };
  }, []);

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    const exitAnim = animation.replace('In', 'Out');
    setExitAnimation(`animate__animated ${exitAnim}`);
    
    setTimeout(() => {
      setShowModal(false);
      setExitAnimation('');
      setSearchTerm('');
    }, 100);
  };

  const handleOutletSelect = (outletName) => {
    setSelectedOutlet(outletName);
    handleCloseModal();
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    if (window.Helpers) {
      const newState = !window.Helpers.isCollapsed();
      window.Helpers.toggleCollapsed();
      
      // Save state to localStorage if enabled
      if (window.config && window.config.enableMenuLocalStorage) {
        try {
          localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, String(newState));
          // Update data-menu-open attribute
          document.documentElement.setAttribute('data-menu-open', String(!newState));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
      
      setIsMenuCollapsed(newState);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div>
    <nav
      className="layout-navbar navbar navbar-expand-xl align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <div className="container-xxl">
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
            <a
              className="nav-item nav-link px-0 me-xl-6"
              href="javascript:void(0)"
              onClick={toggleMenu}
            >
              <i className={`fas fa-${isMenuCollapsed ? 'bars' : 'times'}`} />
            </a>
          </div>
        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          {/* Search */}
          <div className="navbar-nav flex-row">
            <li className="nav-item navbar-search-wrapper">
              <div className="nav-link search-wrapper">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control search-input rounded-pill bg-light border-0 px-4"
                    placeholder="Search Outlet.."
                      value={selectedOutlet || ''}
                    style={{ width: '250px', height: '40px' }}
                    onClick={handleSearchClick}
                    readOnly
                  />
                  <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                </div>
              </div>
            </li>
          </div>

          {/* Right aligned items */}
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            {/* Theme Mode */}
            <li className="nav-item dropdown-style-switcher dropdown me-3">
              <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-sun fa-lg" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-theme="light"
                    >
                      <span className="align-middle">
                        <i className="fas fa-sun fa-lg me-3" />
                        Light
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-theme="dark"
                    >
                      <span className="align-middle">
                        <i className="fas fa-moon fa-lg me-3" />
                        Dark
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                href="javascript:void(0);"
                      data-theme="system"
              >
                      <span className="align-middle">
                        <i className="fas fa-desktop fa-lg me-3" />
                        System
                      </span>
              </a>
                  </li>
                </ul>
            </li>

            {/* User Profile */}
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow"
                href="javascript:void(0);"
                data-bs-toggle="dropdown"
              >
                <div className="avatar avatar-online">
                  <img
                    src={img}
                    alt=""
                    className="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </a>
                <ul className="dropdown-menu dropdown-menu-end mt-3 py-2">
                  <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-account.html"
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-2">
                        <div className="avatar avatar-online">
                          <img
                              src="../../assets/img/avatars/1.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                          <h6 className="mb-0 small">Rahul S</h6>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                    <a className="dropdown-item" href="pages-profile-user.html">
                      <i className="far fa-user fa-lg me-2" />
                      <span className="align-middle">My Profile</span>
                    </a>
                </li>
                <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-account.html"
                    >
                      <i className="fas fa-cog fa-lg me-2" />
                      <span className="align-middle">Settings</span>
                    </a>
                </li>
                <li>
                    <a
                      className="dropdown-item"
                      href="pages-account-settings-billing.html"
                    >
                      <span className="d-flex align-items-center align-middle">
                        <i className="far fa-file-alt fa-lg me-2" />
                        <span className="flex-grow-1 align-middle">
                          Billing
                        </span>
                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger h-px-20 d-flex align-items-center justify-content-center">
                          4
                        </span>
                      </span>
                    </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                
                  <li>
                    <div className="d-grid px-4 pt-2 pb-1">
                      <button
                        className="btn btn-danger d-flex align-items-center justify-content-center"
                        onClick={handleLogout}
                      >
                        <small className="align-middle">Logout</small>
                        <i className="fas fa-sign-out-alt fa-sm ms-2" />
                      </button>
                    </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
          {/* Search Small Screens */}
          <div className="navbar-search-wrapper search-input-wrapper container-xxl d-none">
            <input
              type="text"
              className="form-control search-input  border-0"
              placeholder="Search outlet"
              aria-label="Search outlet"
            />
            <i className="fas fa-times search-toggler cursor-pointer" />
          </div>
        </div>
      </nav>

        {/* Search Modal */}
        {showModal && (
        <>
          <div
            className={`modal ${exitAnimation || `animate__animated ${animation}`}`}
            tabIndex="-1"
            style={{
              display: "block",
              '--animate-duration': '0.2s',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)' // For Safari support
            }} 
            aria-modal="true" 
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-blur">
                <div className="modal-header border-bottom-0 d-flex align-items-center">
                  <h5 className="modal-title flex-grow-1">Select Outlet</h5>
                  <button
                    type="button"
                    className="btn-close cursor-pointer" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                    style={{ margin: '0.25rem 0.25rem auto auto' }}
                  />
                </div>

                <div className="modal-body p-4">
                  {/* Search Box */}
                  <div className="position-relative mb-4">
                      <input
                        type="text"
                      className="form-control search-input"
                      placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-2">
                      {searchTerm && (
                        <button 
                          className="btn btn-text-secondary btn-sm p-0"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear
                        </button>
                      )}
                      <i className="fas fa-search text-muted"></i>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="d-flex gap-2 flex-wrap mb-4">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOutletSelect('Delhi-Petpooja-Demo')}
                    >
                      Delhi-Petpooja-Demo
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOutletSelect('Ahmedabad-Central kitchen-Demo')}
                    >
                      Ahmedabad-Central kitchen-Demo
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOutletSelect('Chennai-Petpooja-Demo')}
                    >
                      Chennai-Petpooja-Demo
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOutletSelect('Pune-Petpooja-Demo')}
                    >
                      Pune-Petpooja-Demo
                    </button>
                  </div>

                  {/* Outlet List */}
                  <div className="list-group">
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('All Outlet')}
                    >
                      <i className="fas fa-building me-3"></i>
                      <div className="flex-grow-1">All Outlet</div>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Ahmedabad-NewHeadoffice-Demo')}
                    >
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Ahmedabad-NewHeadoffice-Demo</div>
                      <small className="text-muted">[ id: 25084 ]</small>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Chennai-Petpooja-Demo')}
                    >
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Chennai-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 2054 ]</small>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Pune-Petpooja-Demo')}
                    >
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Pune-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 8 ]</small>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Ahmedabad-Central kitchen-Demo')}
                    >
                      <i className="fas fa-utensils me-3"></i>
                      <div className="flex-grow-1">Ahmedabad-Central kitchen-Demo</div>
                      <small className="text-muted">[ id: 15344 ]</small>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Delhi-Petpooja-Demo')}
                    >
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Delhi-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 18789 ]</small>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleOutletSelect('Goa-Petpooja-Demo')}
                    >
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Goa-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 6248 ]</small>
                    </button>
                    </div>
                    
                  {/* Animation Select (hidden but keeping functionality) */}
                  <div className="d-none">
                      <AnimationSelect 
                        value={animation} 
                      onChange={setAnimation}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className={`modal-backdrop ${exitAnimation || `animate__animated ${animation}`}`}
            onClick={handleCloseModal}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)'
            }}
          />
        </>
      )}
      </div>
  );
}

export default Header