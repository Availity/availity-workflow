---
title: Testing Libraries
---

By default `@testing-library/react` and `@testing-library/jest-dom/extend-expect` are added to the project. Some of their scripts are also automatically added to the `setUpFilesAfterEnv` param for jest [here](https://github.com/Availity/availity-workflow/blob/master/packages/workflow/jest.config.js#L42).

-   `@testing-library/react/cleanup-after-each` - Will clean up the DOM after each test has ran.
-   `@testing-library/jest-dom/extend-expect` - Custom jest matchers that you can use to extend jest

If you want to override this you can create a file in the `/app` directory called `jest.init.js` and export whichever modules you want.

#### Example

```javascript
module.exports = ['@testing-library/react/cleanup-after-each', '@testing-library/jest-dom/extend-expect'];
```

More Info on Jest `setUpFilesAfterEnv` [here](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array)

### Mocking API Responses

If your tests require data that's supplied by an external data source, you can use the `jest.mock(...)` function to automatically mock the modules used to supply the data.

Once you've mocked the module, you can provide a `mockResolvedValue` that returns the data you want to use for your test.

#### Example

```javascript
import React from 'react';
import axiosMock from 'axios';
import slotmachineResponse from '../data/slotmachine.json';

jest.mock('axios');

axiosMock.mockResolvedValue({
    config: { polling: false },
    data: slotmachineResponse,
    status: 202,
    statusText: 'Ok'
});
```

More info on using mocks in Jest [here](https://jestjs.io/docs/en/mock-functions)
