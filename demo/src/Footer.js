import React from 'react';

function Footer() {
  return (
    <div className="demo-footer">
      <div>
        <span>Copyright {new Date().getFullYear()}.</span>
	      &nbsp;
        <span>All rights reserved</span>
      </div>
    </div>
  );
}

export default Footer;
