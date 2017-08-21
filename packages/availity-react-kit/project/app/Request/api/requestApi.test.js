import { spy } from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import moxios from 'moxios';
import { USER_OPTS, getUser } from './requestApi';

chai.use(sinonChai);
const should = chai.should();

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('Request API', () => {

  describe('getUser', () => {
    it('exists', () => {
      should.exist(getUser);
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
        onFulfilled.should.have.been.called;
      });
    });
  });
});
