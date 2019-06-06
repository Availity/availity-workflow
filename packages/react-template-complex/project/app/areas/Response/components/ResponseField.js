import React from 'react';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';

const ResponseField = ({ label, value, tag: Tag, ...rest }) => (
  <Tag {...rest}>
    <h5 className="text-label">{label}</h5>
    <p>{value}</p>
  </Tag>
);

ResponseField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.symbol,PropTypes.func])
};
ResponseField.defaultProps = {
  tag: Col
}

export default ResponseField;
