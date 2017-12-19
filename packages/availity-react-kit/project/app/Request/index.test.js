import { shallow } from 'enzyme';
import React from 'react';
import { Agreement, Patient, Provider } from './components';

import AuthorizationsRequest from './index';

let request;
beforeEach(() => {
  request = shallow(<AuthorizationsRequest />);
});

describe('AuthorizationsRequest', () => {
  it('renders', () => {
    expect(request).toBeDefined();
    expect(request).toHaveLength(1);
  });

  it('renders request components', () => {
    expect(request).toBeDefined();

    expect(request.find(Patient)).toHaveLength(1);
    expect(request.find(Provider)).toHaveLength(1);
    expect(request.find(Agreement)).toHaveLength(1);
  });
});
