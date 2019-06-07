# @availity/workflow-plugin-react

> Plugin for React based availity-workflow boilerplate projects

- Webpack 4 [https://webpack.js.org/](https://webpack.js.org/)
- Babel [https://babeljs.io/](https://babeljs.io/)
- Jest [https://facebook.github.io/jest/](https://facebook.github.io/jest/)

## Testing Libraries

By default `@testing-library/react` and `jest-dom` are added to the project. Some of their scripts are also automatically added to the `setUpFilesAfterEnv` param for jest [here](./test.js#42).

- `@testing-library/react/cleanup-after-each` - Will clean up the DOM after each test has ran.
- `jest-dom/extend-expect` - Custom jest matchers that you can use to extend jest

If you want to override this you can create a file in the `/app` directory called `jest.init.js` and export whichever modules you want.

#### Example
```javascript
module.exports = [
    '@testing-library/react/cleanup-after-each',
    'jest-dom/extend-expect'
]
```

More Info on Jest `setUpFilesAfterEnv` [here](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array)
