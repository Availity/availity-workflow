// Simple .js file to test compiling and linting for @babel/plugin-proposal-optional-chaining and @babel/plugin-proposal-nullish-coalescing-operator
type ChainObject = {
  org: {
    types: [
      {
        name: string;
        value?: string;
      },
    ];
  };
};

const chainObject: ChainObject = {
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
