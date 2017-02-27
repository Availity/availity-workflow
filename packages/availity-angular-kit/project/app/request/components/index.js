import app from 'app-module';

import patient from './patient';
import provider from './provider';
import agreement from './agreement';

app
  .directive('patientSection', patient)
  .directive('providerSection', provider)
  .directive('agreementSection', agreement);

export default app;

