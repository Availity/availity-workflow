import Response, { Diagnosis, Patient, Payer, Subscriber } from './response';

describe('Response', () => {
  it('can construct with no arguments', () => {
    const response = new Response();
    expect(response).toBeTruthy();
  });

  it('merges simple props', () => {
    const json = {
      certificationNumber: 'certificationNumber',
      customerId: 'customerId',
      status: 'status',
      requestType: 'requestType'
    };

    const response = new Response(json);
    expect(response).toContain(json);
  });

  it('merges composite json properties', () => {
    const json = {
      patient: {},
      subscriber: {},
      diagnoses: [{}],
      payer: {}
    };

    const response = new Response(json);

    expect(response.patient).toBeInstanceOf(Patient);
    expect(response.subscriber).toBeInstanceOf(Subscriber);
    expect(response.payer).toBeInstanceOf(Payer);

    response.diagnoses.forEach(diagnosis => {
      expect(diagnosis).toBeInstanceOf(Diagnosis);
    });
  });
});
