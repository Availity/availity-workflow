import { observable } from 'mobx';
import map from 'lodash.map';

export class Diagnosis {
  @observable qualifier;

  constructor({ qualifier = '' } = {}) {
    this.qualifier = qualifier;
  }
}

export class Patient {
  @observable firstName;
  @observable lastName;
  @observable birthDate;

  constructor({ firstName = '', lastName = '', birthDate = '' } = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
  }
}

export class Payer {
  @observable id;
  @observable name;

  constructor({ id = '', name = '' } = {}) {
    this.id = id;
    this.name = name;
  }
}

export class Subscriber {
  @observable memberId;

  constructor({ memberId = '' } = {}) {
    this.memberId = memberId;
  }
}

export default class Response {
  @observable certificationNumber;
  @observable customerId;
  @observable patient;
  @observable subscriber;
  @observable status;
  @observable diagnoses;
  @observable requestType;
  @observable payer;

  constructor(json) {
    const _json = json || {};

    this.certificationNumber = _json.certificationNumber || '';
    this.customerId = _json.customerId || '';
    this.patient = new Patient(_json.patient);
    this.subscriber = new Subscriber(_json.subscriber);
    this.status = _json.status || '';
    this.diagnoses = map(
      _json.diagnoses,
      diagnosis => new Diagnosis(diagnosis)
    );
    this.requestType = _json.requestType || '';
    this.payer = new Payer(_json.payer);
  }
}
