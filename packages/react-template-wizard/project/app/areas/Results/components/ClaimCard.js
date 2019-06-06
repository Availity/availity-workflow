import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItemStatus } from '@availity/list-group-item';
import { ListGroupItemHeading } from 'reactstrap';
import Entry from './Entry';

const ClaimCard = ({ claimId, dates, status, processed, billed, paid }) => (
  <ListGroupItemStatus color="success">
    <ListGroupItemHeading>
      Claim {claimId}
      <br />
      <small>{dates}</small>
    </ListGroupItemHeading>
    <strong className="text-uppercase">{status}</strong>
    <Entry label="Processed" value={processed} />
    <Entry label="Billed" value={billed} />
    <Entry label="Paid" value={paid} />
  </ListGroupItemStatus>
);

ClaimCard.propTypes = {
  claimId: PropTypes.string,
  dates: PropTypes.string,
  processed: PropTypes.string,
  billed: PropTypes.string,
  status: PropTypes.string,
  paid: PropTypes.string
};

export default ClaimCard;
