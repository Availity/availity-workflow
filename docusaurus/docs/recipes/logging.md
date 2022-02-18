---
title: Setting up Logging
---

Analytics allows you to collect data on clicks and different page events across your application. More detailed prop options and examples can be found [here](https://availity.github.io/availity-react/components/analytics/analytics#props).

## Installation

Run the below command which will install the react component as well as the supporting libraries to send the logs out to our logging services.

```bash
yarn add @availity/analytics @availity/api-axios @availity/api-core
```

## Initializing

### Creating the API Logger

First we have to create the instance of the logger to use for sending data outbound to an analytics service. In this example we will be using the `splunk` analytics `@availity/api-axios` resource as the connection.

We want to import `AvSplunkAnalytics` which is a plugin from the `analytics-core` package which has custom methods for translating our requests into our splunk analytics service format. Then we import the `avLogMessagesApi` from our resources sdk which contains the service call to our `splunk` endpoint.

Lastly we initialize the `analytics-core` plugin with the instance of the log message service and the last flag `true`, is to enable the plugin by default.

```js
import { AvSplunkAnalytics } from '@availity/analytics-core';
import { avLogMessagesApi } from '@availity/api-axios';

const splunkAnalytics = new AvSplunkAnalytics(avLogMessagesApi, true);
```

### Creating the React Component

Next we want to render our `Analytics` component which will allow us to start logging analytics. You want to do this at the root of your App so any `child` component can gain access to the log service.

For this example we will assume we are rendering at the root `index.js`

```jsx
import React from 'react';
import { render } from 'react-dom';
import { avLogMessagesApi } from '@availity/api-axios';
import { AvSplunkAnalytics } from '@availity/analytics-core';
import App from './App';

const splunkAnalytics = new AvSplunkAnalytics(avLogMessagesApi, true);

render(
    <Analytics plugins={[splunkAnalytics]} attributePrefix="data-av-analytics" pageTracking recursive>
        <App />
    </Analytics>,
    document.querySelector('#root')
);
```

Above we passed 4 properties to the component, `plugins`, `attributePrefix`, `pageTracking` and `recursive`. We will get more into the properties down below but just know that for now we passed the instance to the `plugins` prop and the service is now enabled.

## Your First Log Message

Now that the component is initialized we can start to add attributes onto our jsx in order for the analytics to pick up the clicks. Let's use the below example

```html
<a
    href="https://google.com"
    target="_blank"
    data-av-analytics-label="Google"
    data-av-analytics-value="google.com"
    data-av-analytics-action="click"
    >Go To Google
</a>
```

Notice the prefix `data-av-analytics`. This directly corresponds to the `attributePrefix` property that we passed into the Analytics component above. Note that this is the default prefix and we can change that if we want to anything else as long as it doesn't conflict with other key properties on JSX components.

One of the key's here is the `action` attribute. These can be of type `['click','blur','focus']`. In this case we want to log the event when the user `clicks` the link. The output of this when sent outbound to our analytics service looks like the below.

```json hideCopy=true
{
    "level": "info",
    "entries": {
        "label": "Google",
        "value": "google.com",
        "action": "click",
        "event": "click",
        "url": "http://localhost:3000"
    }
}
```

If you were able to add this in you should be seeing a similar log when you click! Next we will go over some of the additional attributes provided to help in logging.

### Adding Page Tracking

In some cases, you may want to log when the page has loaded or the URL hash has changed due to the user navigating to another screen of your application. To simply enable this feature, just pass the `pageTracking` flag to the react component.

Below is an example JSON request that is sent when the user loads the page

```json hideCopy=true
{
    "level": "info",
    "entries": {
        "event": "page",
        "url": "http://localhost:3000/#/some-route
    }
}
```

### Recursive event tracking

This sound confusing, but its fairly simple to follow. In essence, we you click some button or item on the screen, the `event` object has access to all the elements leading up to the root HTML element.

What this means is that we can define our properties early on that are shared in all the clicks and when we enable `recursive` it will be plucked from the clicked element to the root and sent in the request.

```jsx header=Example
<div data-av-analytics-section="links">
    <a
        href="blah"
        data-av-analytics-label="Link One"
        data-av-analytics-value="http://google.com"
        data-av-analytics-action="click"
    >
        Link One
    </a>
    <a
        href="blahblah"
        data-av-analytics-label="Link Two"
        data-av-analytics-value="http://google.com"
        data-av-analytics-action="click"
    >
        Link Two
    </a>
</div>
```

If we enable `recursive` in the react props, then with the above example we would get the JSON request as seen below

```json hideCopy=true
{
    "level": "info",
    "entries": {
        "section": "links",
        "label": "Link One",
        "action": "click",
        "event": "click",
        "value": "http://google.com",
        "url": "http://localhost:3000
    }
}
```

## Summary & References

The above examples show example what log calls would look like hitting our `splunk` analytics service. However, if you want to implement your own `analytics` plugin then the `JSON` payload may differ.

-   [Analytics React Component](https://availity.github.io/availity-react/components/analytics/analytics)
-   [Analytics Core SDK](https://availity.github.io/sdk-js/resources/analytics/)
