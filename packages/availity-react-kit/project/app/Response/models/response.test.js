import { expect } from 'chai';
import Response, {
  Diagnosis,
  Patient,
  Payer,
  Subscriber } from './response';

describe('Response', () => {
  it('can construct with no arguments', () => {
    const response = new Response();
    expect(response).to.exist;
  });

  it('merges simple props', () => {
    const json = {
      certificationNumber: 'certificationNumber',
      customerId: 'customerId',
      status: 'status',
      requestType: 'requestType'
    };

    const response = new Response(json);
    expect(response).to.contain(json);
  });

  it('merges composite json properties', () => {
    const json = {
      patient: {},
      subscriber: {},
      diagnoses: [{}],
      payer: {}
    };

    const response = new Response(json);

    expect(response.patient).to.be.an.instanceOf(Patient);
    expect(response.subscriber).to.be.an.instanceOf(Subscriber);
    expect(response.payer).to.be.an.instanceOf(Payer);

    response.diagnoses.forEach(diagnosis => {
      expect(diagnosis).to.be.an.instanceOf(Diagnosis);
    });
  });
});
