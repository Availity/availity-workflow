import { expect } from 'chai';
import { RequestStore } from './requestStore';
const requestStore = new RequestStore();

describe('RequestStore', () => {
  describe('toggleAcceptedAgreement', () => {
    it('toggles accepted agreement', () => {
      expect(requestStore).to.exist;

      requestStore.toggleAcceptedAgreement();

      expect(requestStore.acceptedAgreement)
        .to.be.true;
    });
  });

  describe('updateMemberId', () => {
    it('updates the member id', () => {
      const id = '12345';
      expect(requestStore).to.exist;
      requestStore.updateMemberId(id);

      expect(requestStore.memberId)
        .to.equal(id);
    });
  });
});
