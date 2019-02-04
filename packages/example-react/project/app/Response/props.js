import PropTypes from 'prop-types';

export default {
  stateStore: PropTypes.shape({
    form: PropTypes.any
  }),
  appStore: PropTypes.shape({
    state: PropTypes.any
  })
};
