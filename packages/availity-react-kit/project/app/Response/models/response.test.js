import chai from 'chai';
import Response, {
  Diagnosis,
  Patient,
  Payer,
  Subscriber } from './response';

const should = chai.should();
describe('Response', () => {
  it('can construct with no arguments', () => {
    const response = new Response();
    should.exist(response);
  });

  it('merges simple props', () => {
    const json = {
      certificationNumber: 'certificationNumber',
      customerId: 'customerId',
      status: 'status',
      requestType: 'requestType'
    };

    const response = new Response(json);
    response.should.contain(json);
  });

  it('merges composite json properties', () => {
    const json = {
      patient: {},
      subscriber: {},
      diagnoses: [{}],
      payer: {}
    };

    const response = new Response(json);

    response.patient.should.be.an.instanceOf(Patient);
    response.subscriber.should.be.an.instanceOf(Subscriber);
    response.payer.should.be.an.instanceOf(Payer);

    response.diagnoses.forEach(diagnosis => {
      diagnosis.should.be.an.instanceOf(Diagnosis);
    });
  });


});
