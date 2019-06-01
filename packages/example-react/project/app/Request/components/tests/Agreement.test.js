import React from 'react';
import { AvForm } from 'availity-reactstrap-validation';
import { render, fireEvent } from '@testing-library/react';
import Agreement from '../Agreement';

describe('Agreement', () => {
  let stores;

  beforeEach(() => {
    stores = { appStore: { toggle: jest.fn() }, stateStore: { acceptTerms: false } };
  });

  it('should not be checked by default', () => {
    const { getByLabelText } = render(
      <AvForm>
        <Agreement {...stores} />
      </AvForm>
    );
    const input = getByLabelText('I agree to the terms and conditions');
    expect(input.checked).toBeFalsy();
  });

  it('should call store when user agrees to disclaimer', () => {
    const { getByLabelText } = render(
      <AvForm>
        <Agreement {...stores} />
      </AvForm>
    );
    const input = getByLabelText('I agree to the terms and conditions');
    fireEvent.click(input);
    expect(input.checked).toBeTruthy();
    expect(stores.appStore.toggle).toHaveBeenCalled();
  });
});
