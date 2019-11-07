// Simple .js file to test compiling and linting for @babel/plugin-proposal-optional-chaining

const chainObject = {
  org: {
    types: [
      {
        name: 'Availity',
      },
    ],
  },
};

const chain = chainObject.org?.types?.[0]?.name;
export default chain;
