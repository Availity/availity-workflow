import React from 'react';
import Breadscrumbs from '@availity/breadcrumbs';

const Header = () => (
  <div>
    <Breadscrumbs active="My Healthcare App" />
    <h2 className="page-header mt-3">
      <div className="page-header-title">
        <span className="app-icon app-icon-blue">ar</span> AR
      </div>
    </h2>
  </div>
);

export default Header;
