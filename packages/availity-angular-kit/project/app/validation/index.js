const validation = {
  organization: {
    required: {
      message: 'Please select an organization',
    },
  },
  npi: {
    required: {
      message: 'NPI is required',
    },
    npi: {
      message: 'NPI must be valid format',
    },
  },
  memberId: {
    required: {
      message: 'Member ID is required',
    },
    pattern: {
      value: /^\d{5}$/,
      message: 'Member ID must be 5 digits',
    },
  },
  dob: {
    dateFormat: {
      format: 'MM/DD/YYYY',
      message: 'Date of birth format should be MM/DD/YYYY',
    },
  },
  agreed: {
    required: {
      message: 'You must agree to terms',
    },
  },
};

export default validation;
