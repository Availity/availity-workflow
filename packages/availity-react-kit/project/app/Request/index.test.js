import { shallow } from 'enzyme';
import React from 'react';
import chai from 'chai';
import { Agreement, Patient, Provider } from './components';

import AuthorizationsRequest from './index';

const should = chai.should();

let request;
beforeEach(() => {
  request = shallow(<AuthorizationsRequest />);
});

describe('AuthorizationsRequest', () => {
  it('renders', () => {
    should.exist(request);
    request.should.have.lengthOf(1);
  });

  it('renders request components', () => {
    should.exist(request);

    request.find(Patient)
      .should.have.lengthOf(1);
    request.find(Provider)
      .should.have.lengthOf(1);
    request.find(Agreement)
      .should.have.lengthOf(1);
  });
});

