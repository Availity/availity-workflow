import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import { Agreement, Patient, Provider } from './components';

import AuthorizationsRequest from './index';

let request;
beforeEach(() => {
  request = shallow(<AuthorizationsRequest />);
});

describe('AuthorizationsRequest', () => {
  it('renders', () => {
    expect(request).to.exist;
    expect(request).to.have.lengthOf(1);
  });

  it('renders request components', () => {
    expect(request).to.exist;

    expect(request.find(Patient)).to.have.lengthOf(1);
    expect(request.find(Provider)).to.have.lengthOf(1);
    expect(request.find(Agreement)).to.have.lengthOf(1);
  });
});
