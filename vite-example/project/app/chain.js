// Simple .js file to test compiling and linting for @babel/plugin-proposal-optional-chaining and @babel/plugin-proposal-nullish-coalescing-operator

const chainObject = {
  org: {
    types: [
      {
        name: 'Availity',
      },
    ],
  },
};

export const chain = chainObject.org?.types?.[0]?.name;
export const nullChain = chainObject.org?.types?.[0]?.value ?? 'iWasCoalesced!';
