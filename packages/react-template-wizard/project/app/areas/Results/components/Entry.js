import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Entry = ({ label, value, className: classes, ...rest }) => (
  <div className={classnames(classes,'d-flex flex-fill justify-content-between')} {...rest}>
    <span className="font-weight-bold">{label}</span>
    <span>{value}</span>
  </div>
);

Entry.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  className: PropTypes.string
};

export default Entry;
