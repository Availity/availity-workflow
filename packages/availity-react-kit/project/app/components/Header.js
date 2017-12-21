import React from 'react';
import Breadscrumbs from '@availity/breadcrumbs-spaces-react';
import uiStore from '../stores/uiStore';

const Header = () => {
  const { title } = uiStore;
  return (
    <div>
      <Breadscrumbs spaceId="1" />
      <h2 className="page-header mt-3">
        <div className="page-header-title">
          <span className="app-icon app-icon-blue">ar</span> {title}
        </div>
      </h2>
    </div>
  );
};

export default Header;
