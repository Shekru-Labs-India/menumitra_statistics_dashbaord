import React from "react";
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";
import PaymentMethodsChart from "../components/PaymentMethodsChart";
import RevenueLossWidget from "../components/RevenueLossWidget";
import TopSell from "../components/TopSell";
import OrderStat from "../components/OrderStat";

function HomeScreen() {
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <VerticalSidebar />
        <div className="layout-page">
          <Header />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <h5 className="card-header">Welcome to MenuMitra Owner Dashboard</h5>
                    <div className="card-body">
                      <p className="mb-4">
                        Select an outlet from the search menu above to view detailed analytics and reports.
                      </p>
                      <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Orders</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <i className="fas fa-shopping-cart"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Revenue</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-success">
                                    <i className="fas fa-rupee-sign"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Customers</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-warning">
                                    <i className="fas fa-users"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Average Order Value</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">₹0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-info">
                                    <i className="fas fa-chart-line"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Table Turnover</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-danger">
                                    <i className="fas fa-chair"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Peak Hours</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-secondary">
                                    <i className="fas fa-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Popular Items</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <i className="fas fa-utensils"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="content-left">
                                  <span className="fw-medium d-block mb-1">Customer Satisfaction</span>
                                  <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-2">0%</h4>
                                    <span className="text-success">(+0%)</span>
                                  </div>
                                </div>
                                <div className="avatar">
                                  <span className="avatar-initial rounded bg-label-success">
                                    <i className="fas fa-smile"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods Chart and Revenue Loss Widget */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <PaymentMethodsChart />
                </div>
                <div className="col-md-6">
                  <RevenueLossWidget />
                </div>
                <div className="row mt-4">
                <div className="col-md-6">
                  <TopSell />
                </div>
                <div className="col-md-6">
                  <OrderStat />
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

export default HomeScreen;
