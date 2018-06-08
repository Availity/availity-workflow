import app from 'app-module';

import patient from './patient';
import provider from './provider';
import agreement from './agreement';
import attachments from './attachments';

app
  .directive('patientSection', patient)
  .directive('providerSection', provider)
  .directive('agreementSection', agreement)
  .directive('attachmentsSection', attachments);

export default app;
