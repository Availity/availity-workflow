"use strict";(self.webpackChunk_availity_dinosaurdocs=self.webpackChunk_availity_dinosaurdocs||[]).push([[912],{6550:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>a,contentTitle:()=>s,default:()=>p,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var n=t(2540),i=t(3023);const r={title:"Configuring Root Imports"},s=void 0,l={id:"recipes/root-imports",title:"Configuring Root Imports",description:"Note that the below recipe only works in Workflow Versions >=7.0.0",source:"@site/docs/recipes/root-imports.md",sourceDirName:"recipes",slug:"/recipes/root-imports",permalink:"/availity-workflow/recipes/root-imports",draft:!1,unlisted:!1,editUrl:"https://github.com/availity/availity-workflow/edit/master/docusaurus/docs/recipes/root-imports.md",tags:[],version:"current",frontMatter:{title:"Configuring Root Imports"},sidebar:"someSidebar",previous:{title:"Testing Libraries",permalink:"/availity-workflow/recipes/testing-libraries"},next:{title:"Adding Typescript Support",permalink:"/availity-workflow/recipes/typescript"}},a={},c=[{value:"Example",id:"example",level:2},{value:"Eslint Config",id:"eslint-config",level:2},{value:"TsConfig For Visual Studio Code",id:"tsconfig-for-visual-studio-code",level:2},{value:"References",id:"references",level:2}];function d(e){const o={a:"a",blockquote:"blockquote",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(o.blockquote,{children:["\n",(0,n.jsxs)(o.p,{children:["Note that the below recipe only works in Workflow Versions ",(0,n.jsx)(o.code,{children:">=7.0.0"})]}),"\n"]}),"\n",(0,n.jsxs)(o.p,{children:["By default we include ",(0,n.jsx)(o.code,{children:"babel-plugin-import"})," which allows you to import components using a specific syntax if you have a tree structure that goes past 2 - 3 layers."]}),"\n",(0,n.jsxs)(o.p,{children:["Using the ",(0,n.jsx)(o.code,{children:"@/"})," key we can alias anything from the root of ",(0,n.jsx)(o.code,{children:"project/app"})," inside of our project. We include the eslint config, and tsconfig so that if you are using vscode you will get all the intellisense for free."]}),"\n",(0,n.jsx)(o.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(o.p,{children:"In the below example, we are"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-jsx",metastring:"hideCopy=true",children:"import React from 'react';\nimport Form from '@/components/Form';\n\n<Form>{/* Stuff */}</Form>;\n"})}),"\n",(0,n.jsx)(o.h2,{id:"eslint-config",children:"Eslint Config"}),"\n",(0,n.jsxs)(o.p,{children:["Make sure you have the latest ",(0,n.jsx)(o.code,{children:"eslint-config-availity"})," installed."]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-bash",children:"yarn add eslint-config-availity@latest --dev\n"})}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-yaml",metastring:"header=.eslintrc.yml",children:"extends: availity/workflow\n"})}),"\n",(0,n.jsx)(o.h2,{id:"tsconfig-for-visual-studio-code",children:"TsConfig For Visual Studio Code"}),"\n",(0,n.jsxs)(o.p,{children:["If you want intellisense in vscode to pick up the root imports and allow you to control click into components you will need to make sure your ",(0,n.jsx)(o.code,{children:"tsconfig.json"})," is updated. We have pasted ours below that we use in our starter projects."]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-json",children:'{\n    "compilerOptions": {\n        "target": "es5",\n        "lib": ["dom", "dom.iterable", "esnext"],\n        "allowJs": true,\n        "skipLibCheck": true,\n        "esModuleInterop": true,\n        "allowSyntheticDefaultImports": true,\n        "strict": true,\n        "forceConsistentCasingInFileNames": true,\n        "module": "esnext",\n        "moduleResolution": "node",\n        "resolveJsonModule": true,\n        "isolatedModules": true,\n        "noEmit": true,\n        "jsx": "react",\n        "baseUrl": ".",\n        "paths": {\n            "@/*": ["./project/app/*"]\n        }\n    }\n}\n'})}),"\n",(0,n.jsx)(o.h2,{id:"references",children:"References"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsx)(o.li,{children:(0,n.jsx)(o.a,{href:"https://www.npmjs.com/package/babel-plugin-root-import",children:"babel-plugin-root-import"})}),"\n",(0,n.jsx)(o.li,{children:(0,n.jsx)(o.a,{href:"https://www.npmjs.com/package/eslint-import-resolver-babel-plugin-root-import",children:"eslint-root-import-resolver"})}),"\n"]})]})}function p(e={}){const{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3023:(e,o,t)=>{t.d(o,{R:()=>s,x:()=>l});var n=t(3696);const i={},r=n.createContext(i);function s(e){const o=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function l(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),n.createElement(r.Provider,{value:o},e.children)}}}]);