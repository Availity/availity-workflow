import React from 'react';
import Breadscrumbs from '@availity/breadcrumbs-spaces-react';

const Header = () => (
  <div>
    <Breadscrumbs pageName="My Healthcare App" />
    <h2 className="page-header mt-3">
      <div className="page-header-title">
        <span className="app-icon app-icon-blue">ar</span> AR
      </div>
    </h2>
  </div>
);

export default Header;
