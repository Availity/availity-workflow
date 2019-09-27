---
title: React
summary: Plugin for React based availity-workflow boilerplate projects
---

- Webpack 4 [https://webpack.js.org/](https://webpack.js.org/)
- Babel [https://babeljs.io/](https://babeljs.io/)
- Jest [https://facebook.github.io/jest/](https://facebook.github.io/jest/)

## Testing Libraries

By default `@testing-library/react` and `@testing-library/jest-dom/extend-expect` are added to the project. Some of their scripts are also automatically added to the `setUpFilesAfterEnv` param for jest [here](https://github.com/Availity/availity-workflow/blob/master/packages/workflow-plugin-react/test.js#L38).

- `@testing-library/react/cleanup-after-each` - Will clean up the DOM after each test has ran.
- `@testing-library/jest-dom/extend-expect` - Custom jest matchers that you can use to extend jest

If you want to override this you can create a file in the `/app` directory called `jest.init.js` and export whichever modules you want.

#### Example
```javascript
module.exports = [
    '@testing-library/react/cleanup-after-each',
    '@testing-library/jest-dom/extend-expect'
]
```

More Info on Jest `setUpFilesAfterEnv` [here](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array)
