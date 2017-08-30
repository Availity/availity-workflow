import React from 'react';
import uiStore from '../stores/uiStore';

const Footer = () => {
  const { year } = uiStore;
  return (
    <p className="text-center mt-3">
      Made with <i className="icon icon-heart text-danger" /> by <a href="http://www.availity.com">Availity</a> {year}
    </p>
  );
};

export default Footer;
