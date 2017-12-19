import { RequestStore } from './requestStore';

const requestStore = new RequestStore();

describe('RequestStore', () => {
  describe('toggleAcceptedAgreement', () => {
    it('toggles accepted agreement', () => {
      expect(requestStore).toBeDefined();

      requestStore.toggleAcceptedAgreement();

      expect(requestStore.acceptedAgreement).toBeTruthy();
    });
  });

  describe('updateMemberId', () => {
    it('updates the member id', () => {
      const id = '12345';
      expect(requestStore).toBeDefined();
      requestStore.updateMemberId(id);

      expect(requestStore.memberId).toBe(id);
    });
  });
});
