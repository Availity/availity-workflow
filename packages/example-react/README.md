# example-react

> DO NOT USE AS TEMPLATE FOR PROJECTS. THIS IS FOR CONTRIBUTORS TO TEST OUT CHANGES.

## https://github.com/Availity/availity-workflow#react

### Get Started

```bash
npm start
```
### Features
#### Import Aliasing 
When you app gets deeply nested with components that are referencing folders 2 layers outside of your current directory this feature comes in handy.
##### Usage
```javascript
// Our Project Root is already set to project/app
import Test from '../../../../components/Test'; // Without aliasing
import Test from '~/components/Test'; // With aliasing
```
