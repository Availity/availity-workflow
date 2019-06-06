import PropTypes from 'prop-types';

const serviceLineProps = {
  dates: PropTypes.string,
  procedureCode: PropTypes.string,
  quantity: PropTypes.number,
  revenueCode: PropTypes.string,
  copay: PropTypes.string,
  deductible: PropTypes.string,
  paid: PropTypes.string,
};

export default {
  claim: {
    claimId: PropTypes.string,
    dates: PropTypes.string,
    status: PropTypes.string,
    processed: PropTypes.string,
    billed: PropTypes.string,
    paid: PropTypes.string,
    serviceLines: PropTypes.arrayOf(
      PropTypes.shape({
        ...serviceLineProps,
      })
    ),
  },
  serviceLine: serviceLineProps,
};
