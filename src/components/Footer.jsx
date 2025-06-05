import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <>
  {/* Hello world */}
  <footer className="content-footer footer bg-footer-theme">
    <div className="container-xxl">
      <div className="footer-container d-flex align-items-center justify-content-end py-4 flex-md-row flex-column">
        <div className="text-body mb-2 mb-md-0">
          © MenuMitra, Powered{" "}
          <span className="text-danger">
            
          </span>{" "}
          by{" "}
          <a
            href="https://shekruweb.com/"
            target="_blank"
            className="footer-link"
          >
            Shekru Labs India Pvt. Ltd.
          </a>
         
        </div>
        
      </div>
    </div>
  </footer>
</>

  );
};

export default Footer;