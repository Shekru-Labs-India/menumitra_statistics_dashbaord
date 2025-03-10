import React, { useState, useEffect } from 'react'
import img from '../assets/img/avatars/1.png'
import 'animate.css'
import AnimationSelect from './AnimationSelect'

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState('animate__fadeIn');
  const [exitAnimation, setExitAnimation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Get the exit animation by replacing "In" with "Out" in the current animation
    const exitAnim = animation.replace('In', 'Out');
    setExitAnimation(`animate__animated ${exitAnim}`);
    
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setShowModal(false);
      setExitAnimation('');
    }, 500);
  };

  // Add event listener for ESC key
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
          <div className="navbar-brand app-brand demo d-none d-xl-flex py-0 me-6">
            <a href="index.html" className="app-brand-link gap-2">
              <span className="app-brand-logo demo">
                <span style={{ color: "var(--bs-primary)" }}>
                  <svg
                    width={30}
                    height={24}
                    viewBox="0 0 250 196"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.3002 1.25469L56.655 28.6432C59.0349 30.1128 60.4839 32.711 60.4839 35.5089V160.63C60.4839 163.468 58.9941 166.097 56.5603 167.553L12.2055 194.107C8.3836 196.395 3.43136 195.15 1.14435 191.327C0.395485 190.075 0 188.643 0 187.184V8.12039C0 3.66447 3.61061 0.0522461 8.06452 0.0522461C9.56056 0.0522461 11.0271 0.468577 12.3002 1.25469Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.077704"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 65.2656L60.4839 99.9629V133.979L0 65.2656Z"
                      fill="black"
                    />
                    <path
                      opacity="0.077704"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 65.2656L60.4839 99.0795V119.859L0 65.2656Z"
                      fill="black"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M237.71 1.22393L193.355 28.5207C190.97 29.9889 189.516 32.5905 189.516 35.3927V160.631C189.516 163.469 191.006 166.098 193.44 167.555L237.794 194.108C241.616 196.396 246.569 195.151 248.856 191.328C249.605 190.076 250 188.644 250 187.185V8.09597C250 3.64006 246.389 0.027832 241.935 0.027832C240.444 0.027832 238.981 0.441882 237.71 1.22393Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.077704"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M250 65.2656L189.516 99.8897V135.006L250 65.2656Z"
                      fill="black"
                    />
                    <path
                      opacity="0.077704"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M250 65.2656L189.516 99.0497V120.886L250 65.2656Z"
                      fill="black"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.2787 1.18923L125 70.3075V136.87L0 65.2465V8.06814C0 3.61223 3.61061 0 8.06452 0C9.552 0 11.0105 0.411583 12.2787 1.18923Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.2787 1.18923L125 70.3075V136.87L0 65.2465V8.06814C0 3.61223 3.61061 0 8.06452 0C9.552 0 11.0105 0.411583 12.2787 1.18923Z"
                      fill="white"
                      fillOpacity="0.15"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M237.721 1.18923L125 70.3075V136.87L250 65.2465V8.06814C250 3.61223 246.389 0 241.935 0C240.448 0 238.99 0.411583 237.721 1.18923Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M237.721 1.18923L125 70.3075V136.87L250 65.2465V8.06814C250 3.61223 246.389 0 241.935 0C240.448 0 238.99 0.411583 237.721 1.18923Z"
                      fill="white"
                      fillOpacity="0.3"
                    />
                  </svg>
                </span>
              </span>
              <span className="app-brand-text demo menu-text fw-semibold ms-1">
                Materio
              </span>
            </a>
            <a
              href="javascript:void(0);"
              className="layout-menu-toggle menu-link text-large ms-auto d-xl-none"
            >
              <i className="fas fa-times" />
            </a>
          </div>
          {/* <button
            type="button"
            class="btn btn-label-primary dropdown-toggle waves-effect"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Primary
          </button> */}
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0  d-xl-none  ">
            <a
              className="nav-item nav-link px-0 me-xl-6"
              href="javascript:void(0)"
            >
              <i className="fas fa-bars" />
            </a>
          </div>
          <div
            className="navbar-nav-right d-flex align-items-center"
            id="navbar-collapse"
          >
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Search */}
              <li className="nav-item navbar-search-wrapper me-1 me-xl-0">
                <a
                  className="nav-link search-toggler"
                  href="javascript:void(0);"
                  onClick={handleSearchClick}
                >
                  <i className="fas fa-search fa-lg me-2" />
                </a>
              </li>
              {/* /Search */}
              {/* Language */}
              <li className="nav-item dropdown-language dropdown">
                <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-language fa-lg" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end py-2">
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-language="en"
                      data-text-direction="ltr"
                    >
                      <span className="align-middle">English</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-language="fr"
                      data-text-direction="ltr"
                    >
                      <span className="align-middle">French</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-language="ar"
                      data-text-direction="rtl"
                    >
                      <span className="align-middle">Arabic</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="javascript:void(0);"
                      data-language="de"
                      data-text-direction="ltr"
                    >
                      <span className="align-middle">German</span>
                    </a>
                  </li>
                </ul>
              </li>
              {/*/ Language */}
              {/* Style Switcher */}
              <li className="nav-item dropdown-style-switcher dropdown">
                <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-sun fa-lg me-3" />
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
              {/* / Style Switcher*/}
              {/* Quick links  */}
              <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown">
                <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <i className="far fa-star fa-lg" />
                </a>
                <div className="dropdown-menu dropdown-menu-end py-0">
                  <div className="dropdown-menu-header border-bottom py-50">
                    <div className="dropdown-header d-flex align-items-center py-2">
                      <h6 className="mb-0 me-auto">Shortcuts</h6>
                      <a
                        href="javascript:void(0)"
                        className="btn btn-text-secondary rounded-pill btn-icon dropdown-shortcuts-add"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Add shortcuts"
                      >
                        <i className="fas fa-th-large fa-lg text-heading" />
                      </a>
                    </div>
                  </div>
                  <div className="dropdown-shortcuts-list scrollable-container">
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="far fa-calendar fa-lg text-heading" />
                        </span>
                        <a href="app-calendar.html" className="stretched-link">
                          Calendar
                        </a>
                        <small>Appointments</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="far fa-file-alt fa-lg text-heading" />
                        </span>
                        <a
                          href="app-invoice-list.html"
                          className="stretched-link"
                        >
                          Invoice App
                        </a>
                        <small>Manage Accounts</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="far fa-user fa-lg text-heading" />
                        </span>
                        <a href="app-user-list.html" className="stretched-link">
                          User App
                        </a>
                        <small>Manage Users</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="fas fa-desktop fa-lg text-heading" />
                        </span>
                        <a
                          href="app-access-roles.html"
                          className="stretched-link"
                        >
                          Role Management
                        </a>
                        <small>Permission</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="fas fa-chart-pie fa-lg text-heading" />
                        </span>
                        <a href="index.html" className="stretched-link">
                          Dashboard
                        </a>
                        <small>Analytics</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="fas fa-cog fa-lg text-heading" />
                        </span>
                        <a
                          href="pages-account-settings-account.html"
                          className="stretched-link"
                        >
                          Setting
                        </a>
                        <small>Account Settings</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="far fa-question-circle fa-lg text-heading" />
                        </span>
                        <a href="pages-faq.html" className="stretched-link">
                          FAQs
                        </a>
                        <small className="text-muted mb-0">
                          FAQs &amp; Articles
                        </small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                          <i className="fas fa-tv fa-lg text-heading" />
                        </span>
                        <a
                          href="modal-examples.html"
                          className="stretched-link"
                        >
                          Modals
                        </a>
                        <small>Useful Popups</small>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/* Quick links */}
              {/* Notification */}
              <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-4 me-xl-1">
                <a
                  className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <i className="far fa-bell fa-lg" />
                  <span className="position-absolute top-0 start-50 translate-middle-y badge badge-dot bg-danger mt-2 border" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end py-0">
                  <li className="dropdown-menu-header border-bottom">
                    <div className="dropdown-header d-flex align-items-center py-3">
                      <h6 className="mb-0 me-auto">Notification</h6>
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-pill bg-label-primary me-2">
                          8 New
                        </span>
                        <a
                          href="javascript:void(0)"
                          className="btn btn-text-secondary rounded-pill btn-icon dropdown-notifications-all"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Mark all as read"
                        >
                          <i className="far fa-envelope-open fa-lg text-body" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-notifications-list scrollable-container">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img
                                src={img}
                                alt=""
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="small mb-1">
                              Congratulation Lettie 🎉
                            </h6>
                            <small className="mb-1 d-block text-body">
                              Won the monthly best seller gold badge
                            </small>
                            <small className="text-muted">1h ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-danger">
                                CF
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">Charles Franklin</h6>
                            <small className="mb-1 d-block text-body">
                              Accepted your connection
                            </small>
                            <small className="text-muted">12hr ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img
                                src="../../assets/img/avatars/2.png"
                                alt=""
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">New Message ✉️</h6>
                            <small className="mb-1 d-block text-body">
                              You have new message from Natalie
                            </small>
                            <small className="text-muted">1h ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-success">
                                <i className="fas fa-shopping-cart" />
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">
                              Whoo! You have new order 🛒{" "}
                            </h6>
                            <small className="mb-1 d-block text-body">
                              ACME Inc. made new order $1,154
                            </small>
                            <small className="text-muted">1 day ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img
                                src="../../assets/img/avatars/9.png"
                                alt=""
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">
                              Application has been approved 🚀{" "}
                            </h6>
                            <small className="mb-1 d-block text-body">
                              Your ABC project application has been approved.
                            </small>
                            <small className="text-muted">2 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-success">
                                <i className="fas fa-chart-pie fa-lg text-heading" />
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">
                              Monthly report is generated
                            </h6>
                            <small className="mb-1 d-block text-body">
                              July monthly financial report is generated{" "}
                            </small>
                            <small className="text-muted">3 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img
                                src="../../assets/img/avatars/5.png"
                                alt=""
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">
                              Send connection request
                            </h6>
                            <small className="mb-1 d-block text-body">
                              Peter sent you connection request
                            </small>
                            <small className="text-muted">4 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img
                                src="../../assets/img/avatars/6.png"
                                alt=""
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">
                              New message from Jane
                            </h6>
                            <small className="mb-1 d-block text-body">
                              Your have new message from Jane
                            </small>
                            <small className="text-muted">5 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-warning">
                                <i className="fas fa-exclamation-triangle" />
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 small">CPU is running high</h6>
                            <small className="mb-1 d-block text-body">
                              CPU Utilization Percent is currently at 88.63%,
                            </small>
                            <small className="text-muted">5 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-read"
                            >
                              <span className="badge badge-dot" />
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="dropdown-notifications-archive"
                            >
                              <i className="fas fa-times" />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className="border-top">
                    <div className="d-grid p-4">
                      <a
                        className="btn btn-primary btn-sm d-flex"
                        href="javascript:void(0);"
                      >
                        <small className="align-middle">
                          View all notifications
                        </small>
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
              {/*/ Notification */}
              {/* User */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a
                  className="nav-link dropdown-toggle hide-arrow p-0"
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
                          <h6 className="mb-0 small">John Doe</h6>
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
                    <a className="dropdown-item" href="pages-pricing.html">
                      <i className="fas fa-dollar-sign fa-lg me-2" />
                      <span className="align-middle">Pricing</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-faq.html">
                      <i className="far fa-question-circle fa-lg me-2" />
                      <span className="align-middle">FAQ</span>
                    </a>
                  </li>
                  <li>
                    <div className="d-grid px-4 pt-2 pb-1">
                      <a
                        className="btn btn-danger d-flex"
                        href="auth-login-cover.html"
                        target="_blank"
                      >
                        <small className="align-middle">Logout</small>
                        <i className="fas fa-sign-out-alt fa-sm ms-2" />
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
              {/*/ User */}
            </ul>
          </div>
          {/* Search Small Screens */}
          <div className="navbar-search-wrapper search-input-wrapper container-xxl d-none">
            <input
              type="text"
              className="form-control search-input  border-0"
              placeholder="Search..."
              aria-label="Search..."
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
            style={{display: "block"}} 
            aria-modal="true" 
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header d-flex align-items-center">
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
                    <button className="btn btn-outline-primary btn-sm">
                      Delhi-Petpooja-Demo
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      Ahmedabad-Central kitchen-Demo
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      Chennai-Petpooja-Demo
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      Pune-Petpooja-Demo
                    </button>
                  </div>

                  {/* Outlet List */}
                  <div className="list-group">
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-building me-3"></i>
                      <div className="flex-grow-1">All Outlet</div>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Ahmedabad-NewHeadoffice-Demo</div>
                      <small className="text-muted">[ id: 25084 ]</small>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Chennai-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 2054 ]</small>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Pune-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 8 ]</small>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-utensils me-3"></i>
                      <div className="flex-grow-1">Ahmedabad-Central kitchen-Demo</div>
                      <small className="text-muted">[ id: 15344 ]</small>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
                      <i className="fas fa-store me-3"></i>
                      <div className="flex-grow-1">Delhi-Petpooja-Demo</div>
                      <small className="text-muted">[ id: 18789 ]</small>
                    </button>
                    <button className="list-group-item list-group-item-action d-flex align-items-center">
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
          />
        </>
      )}
    </div>
  );
}

export default Header