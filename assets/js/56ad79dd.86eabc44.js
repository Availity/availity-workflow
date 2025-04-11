"use strict";(self.webpackChunk_availity_dinosaurdocs=self.webpackChunk_availity_dinosaurdocs||[]).push([[489],{3023:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>o});var n=s(3696);const r={},i=n.createContext(r);function a(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),n.createElement(i.Provider,{value:t},e.children)}},7794:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"recipes/testing-libraries","title":"Testing Libraries","description":"By default @testing-library/react and @testing-library/jest-dom/extend-expect are added to the project. Some of their scripts are also automatically added to the setupFilesAfterEnv param for jest here.","source":"@site/docs/recipes/testing-libraries.md","sourceDirName":"recipes","slug":"/recipes/testing-libraries","permalink":"/availity-workflow/recipes/testing-libraries","draft":false,"unlisted":false,"editUrl":"https://github.com/availity/availity-workflow/edit/master/docusaurus/docs/recipes/testing-libraries.md","tags":[],"version":"current","frontMatter":{"title":"Testing Libraries"},"sidebar":"someSidebar","previous":{"title":"Dependency Management","permalink":"/availity-workflow/tutorial/dependency-management"},"next":{"title":"Configuring Root Imports","permalink":"/availity-workflow/recipes/root-imports"}}');var r=s(2540),i=s(3023);const a={title:"Testing Libraries"},o=void 0,c={},l=[{value:"Example",id:"example",level:2},{value:"Mocking API Responses",id:"mocking-api-responses",level:3},{value:"Example",id:"example-1",level:2}];function d(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["By default ",(0,r.jsx)(t.code,{children:"@testing-library/react"})," and ",(0,r.jsx)(t.code,{children:"@testing-library/jest-dom/extend-expect"})," are added to the project. Some of their scripts are also automatically added to the ",(0,r.jsx)(t.code,{children:"setupFilesAfterEnv"})," param for jest ",(0,r.jsx)(t.a,{href:"https://github.com/Availity/availity-workflow/blob/master/packages/workflow/jest.config.js#L38",children:"here"}),"."]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"@testing-library/react/cleanup-after-each"})," - Will clean up the DOM after each test has ran."]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"@testing-library/jest-dom/extend-expect"})," - Custom jest matchers that you can use to extend jest"]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["If you want to override this you can create a file in the ",(0,r.jsx)(t.code,{children:"/app"})," directory called ",(0,r.jsx)(t.code,{children:"jest.init.js"})," and export whichever modules you want."]}),"\n",(0,r.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-javascript",children:"module.exports = ['@testing-library/react/cleanup-after-each', '@testing-library/jest-dom/extend-expect'];\n"})}),"\n",(0,r.jsxs)(t.p,{children:["More Info on Jest ",(0,r.jsx)(t.code,{children:"setupFilesAfterEnv"})," ",(0,r.jsx)(t.a,{href:"https://jestjs.io/docs/en/configuration#setupfilesafterenv-array",children:"here"})]}),"\n",(0,r.jsx)(t.h3,{id:"mocking-api-responses",children:"Mocking API Responses"}),"\n",(0,r.jsxs)(t.p,{children:["If your tests require data that's supplied by an external data source, you can use the ",(0,r.jsx)(t.code,{children:"jest.mock(...)"})," function to automatically mock the modules used to supply the data."]}),"\n",(0,r.jsxs)(t.p,{children:["Once you've mocked the module, you can provide a ",(0,r.jsx)(t.code,{children:"mockResolvedValue"})," that returns the data you want to use for your test."]}),"\n",(0,r.jsx)(t.h2,{id:"example-1",children:"Example"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-javascript",children:"import React from 'react';\nimport axiosMock from 'axios';\nimport slotmachineResponse from '../data/slotmachine.json';\n\njest.mock('axios');\n\naxiosMock.mockResolvedValue({\n    config: { polling: false },\n    data: slotmachineResponse,\n    status: 202,\n    statusText: 'Ok'\n});\n"})}),"\n",(0,r.jsxs)(t.p,{children:["More info on using mocks in Jest ",(0,r.jsx)(t.a,{href:"https://jestjs.io/docs/en/mock-functions",children:"here"})]})]})}function p(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}}}]);