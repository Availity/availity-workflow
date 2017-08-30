import { spy } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import moxios from 'moxios';
import { USER_OPTS, getUser } from './requestApi';

chai.use(sinonChai);

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('Request API', () => {

  describe('getUser', () => {
    it('exists', () => {
      expect(getUser).to.exist;
    });

    it('GETs users api', () => {
      moxios.stubRequest(USER_OPTS, {
        status: 200,
        response:
        {
          id: 'aka123456789',
          lastName: 'Smith',
          firstName: 'Jane',
          email: 'jane.smith@example.com'
        }
      });

      const onFulfilled = spy();
      getUser().then(onFulfilled);

      moxios.wait(() => {
        expect(onFulfilled).to.have.been.called;
      });
    });
  });
});
