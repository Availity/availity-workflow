import chai from 'chai';
import { RequestStore } from './requestStore';
const requestStore = new RequestStore();
const should = chai.should();

describe('RequestStore', () => {
  describe('toggleAcceptedAgreement', () => {
    it('toggles accepted agreement', () => {
      should.exist(requestStore);

      requestStore.toggleAcceptedAgreement();

      requestStore.acceptedAgreement
        .should.be.true;
    });
  });

  describe('updateMemberId', () => {
    it('updates the member id', () => {
      const id = '12345';
      should.exist(requestStore);
      requestStore.updateMemberId(id);

      requestStore.memberId
        .should.equal(id);
    });
  });
});
