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

  constructor(json = {}) {
    this.certificationNumber = json.certificationNumber || '';
    this.customerId = json.customerId || '';
    this.patient = new Patient(json.patient);
    this.subscriber = new Subscriber(json.subscriber);
    this.status = json.status || '';
    this.diagnoses = map(json.diagnoses, diagnosis => new Diagnosis(diagnosis));
    this.requestType = json.requestType || '';
    this.payer = new Payer(json.payer);
  }
}
