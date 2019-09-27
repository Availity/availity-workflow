---
title: Angular
summary: Plugin for Angular based availity-workflow boilerplate projects
---

- Webpack 4 [https://webpack.js.org/](https://webpack.js.org/)
- Babel [https://babeljs.io/](https://babeljs.io/)
- Jest [https://facebook.github.io/jest/](https://facebook.github.io/jest/)


## Testing Libraries

By default `angular` and `angular-mocks` are added to the project. Some of their scripts are also automatically added to the `setUpFilesAfterEnv` param for jest [here](https://github.com/Availity/availity-workflow/blob/master/packages/workflow-plugin-angular/test.js#L27).

- `angular` - base angular framework.
- `angular-mocks` - same mocks available for use in angular framework.

If you want to override this you can create a file in the `/app` directory called `jest.init.js` and export whichever modules you want.

#### Example
```javascript
module.exports = [
    'angular',
    'angular-mocks'
]
```

More Info on Jest `setUpFilesAfterEnv` [here](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array)
