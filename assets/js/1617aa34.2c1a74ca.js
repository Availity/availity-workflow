"use strict";(self.webpackChunk_availity_dinosaurdocs=self.webpackChunk_availity_dinosaurdocs||[]).push([[433],{1573:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>t,metadata:()=>o,toc:()=>c});var r=s(2540),a=s(3023);const t={title:"Reference: Mock Server"},i=void 0,o={id:"reference/mock-server",title:"Reference: Mock Server",description:"Intro",source:"@site/docs/reference/mock-server.md",sourceDirName:"reference",slug:"/reference/mock-server",permalink:"/availity-workflow/reference/mock-server",draft:!1,unlisted:!1,editUrl:"https://github.com/availity/availity-workflow/edit/master/docusaurus/docs/reference/mock-server.md",tags:[],version:"current",frontMatter:{title:"Reference: Mock Server"},sidebar:"someSidebar",previous:{title:"Reference: CLI Commands",permalink:"/availity-workflow/reference/commands"}},l={},c=[{value:"Intro",id:"intro",level:2},{value:"Route Matching",id:"route-matching",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Standalone Server",id:"standalone-server",level:3},{value:"Express Middleware",id:"express-middleware",level:3},{value:"Options",id:"options",level:2},{value:"Route Configuration Examples",id:"route-configuration-examples",level:2},{value:"Simple",id:"simple",level:3},{value:"Status Code",id:"status-code",level:3},{value:"POST with Default Response",id:"post-with-default-response",level:3},{value:"CRUD",id:"crud",level:3},{value:"CRUD using objects",id:"crud-using-objects",level:3},{value:"Query Params with Arrays and Regexes",id:"query-params-with-arrays-and-regexes",level:3},{value:"POST Params",id:"post-params",level:3},{value:"Multipart",id:"multipart",level:3},{value:"Async Responses",id:"async-responses",level:3},{value:"Async Responses with Repeat Option",id:"async-responses-with-repeat-option",level:3},{value:"Match Headers",id:"match-headers",level:3},{value:"Url Redirect",id:"url-redirect",level:3},{value:"Acknowledgements",id:"acknowledgements",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"intro",children:"Intro"}),"\n",(0,r.jsx)(n.p,{children:"Develop web applications without heavy back-end services by running Express middleware or http server which can deliver mock responses."}),"\n",(0,r.jsxs)(n.p,{children:["Responses can be JSON or other formats to simulate REST services. Access-Control HTTP Headers are set by default to allow CORS requests. Mock services are configured in the ",(0,r.jsx)(n.a,{href:"https://github.com/Availity/availity-workflow/blob/master/packages/mock-data/routes.json",children:"routes.json"})," file."]}),"\n",(0,r.jsxs)(n.p,{children:["This server can return other file types besides XML or JSON (PDFs, images, etc). The appropriate response headers will be automatically set for different file types. For a complete list of file types supported view the ",(0,r.jsx)(n.a,{href:"https://github.com/jshttp/mime-db/blob/88d8b0424d93aefef4ef300dc35ad2c8d1e1f9d4/db.json",children:"mime types here"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"route-matching",children:"Route Matching"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"availity-mock-server"})," is designed to respond with the route configuration that matches the incoming request the closest by introspecting the request body, parameters and headers. ",(0,r.jsx)(n.code,{children:"availity-mock-server"})," calculates which route scores the highest for each request and returns the appropriate mock response."]}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(n.h3,{id:"standalone-server",children:"Standalone Server"}),"\n",(0,r.jsxs)(n.p,{children:["The default server configuration can be found in ",(0,r.jsx)(n.a,{href:"https://github.com/Availity/availity-workflow/blob/master/packages/mock-server/config/index.js",children:"config.js"}),". Pass a different configuration file to the ",(0,r.jsx)(n.code,{children:"availity-mock-server"})," server to override the defaults."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const path = require('path');\nconst MockServer = require('@availity/mock-server');\n\nconst configPath = path.join(__dirname, 'path/to/config.js');\nconst server = new MockServer(configPath);\nserver.start();\n"})}),"\n",(0,r.jsx)(n.p,{children:"Alternatively, pass options in the start method."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const  = new MockServer();\n.start({\n    data: path.join(__dirname, './data'),\n    routes: path.join(__dirname, './routes'),\n    plugins: ['@availity/mock-data']\n}).then(function() {\n    // server started\n});\n"})}),"\n",(0,r.jsx)(n.h3,{id:"express-middleware",children:"Express Middleware"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const express = require('express');\nconst app = express();\n\n// This is the same as the stand-alone server use.\nconst MockServer = require('@availity/mock-server');\nconst server = new MockServer({/* options */});\n\napp.use(server.middleware(/* options, same as `start` */);\n\napp.listen(3001);\n"})}),"\n",(0,r.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"latency"}),": Global delay for all reponses. The latency can be overridden per route configuration. Default is ",(0,r.jsx)(n.code,{children:"250ms"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"limit"}),": Upload max size. Default is ",(0,r.jsx)(n.code,{children:"50mb"}),","]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"host"}),": Server binds and listens for connections on the specified host. Default is ",(0,r.jsx)(n.code,{children:"0.0.0.0"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"port"}),": Server binds and listens for connections on the specified port. Default is ",(0,r.jsx)(n.code,{children:"9999"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"data"}),": Path to folder that contains the json mock responses."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"routes"}),": Path(s) to configuration file that contains a mapping of the request/response routes. Multiple paths can be passed in with an array of strings."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"plugins"}),": Array of NPM module names that enhance ",(0,r.jsx)(n.code,{children:"@availity/mock-server"})," with additional data and routes. @See ",(0,r.jsx)(n.a,{href:"https://github.com/Availity/availity-workflow/tree/master/packages/mock-data",children:"@availity/mock-data"})]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"logProvider"}),": Function that returns a logger that is used in place of the default logger. Inspired by the log provider in ",(0,r.jsx)(n.a,{href:"https://github.com/chimurai/http-proxy-middleware",children:"http-proxy-middleware"})]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"pluginContext"}),": A url context value which is used to rewrite every instance of ",(0,r.jsx)(n.code,{children:"${context}"})," variable in mock data responses. This can be useful for HATEOS links."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Simple"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"function logProvider(provider) {\n    return require('winston');\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Advanced"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"function logProvider(provider) {\n    var logger = new (require('winston').Logger)();\n\n    var myCustomProvider = {\n        log: logger.log,\n        debug: logger.debug,\n        info: logger.info,\n        warn: logger.warn,\n        error: logger.error\n    };\n    return myCustomProvider;\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"route-configuration-examples",children:"Route Configuration Examples"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"routes.json"})," defines the mock responses for rest services. Below are some sample scenarios that should help you understand the configuration options."]}),"\n",(0,r.jsx)(n.p,{children:"The mock configuration supports deep nested introspection of JSON and multi-part form data when matching routes. See Example 6 below."}),"\n",(0,r.jsx)(n.h3,{id:"simple",children:"Simple"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route1": {\n  "file": "example1.json" // response for GET|PUT|POST|DELETE\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"status-code",children:"Status Code"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route2": {\n  "latency": 250, // latency in (ms)\n  "file": "example2.json", // all GET|PUT|POST|DELETE requests\n  "status": 201 // return status code 201\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"post-with-default-response",children:"POST with Default Response"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route3": {\n  "file": "example3.json", // GET|PUT|DELETE requests\n  "post": "example1.json" // POST requests\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"crud",children:"CRUD"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route4": {\n  "get": "example1.json", // all GET requests\n  "put": "example2.json", // all PUT requests\n  "post": "example3.json", // all POST requests\n  "delete": "example4.json" // all DELETE requests\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"crud-using-objects",children:"CRUD using objects"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route4": {\n  "get": {// all GET requests\n      "status": 204,\n      "responseHeader": {\n          "a": "1",\n          "b": "2"\n      }\n  },\n  "put": {// all PUT requests\n      "file": "example1.json",\n  },\n  "post": "example3.json", // all POST requests\n  "delete": "example4.json" // all DELETE requests\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"query-params-with-arrays-and-regexes",children:"Query Params with Arrays and Regexes"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route5": {\n  "file": "example1.json", // all POST|PUT|DELETE requests\n  "get": [\n    {\n      "file": "example2.json",\n      "status": 200, // default status code is 200\n      "params": { // GET /v1/router?a=1&b=2&c=3\n        "a": "1",\n        "b": "2",\n        "c": "3"\n      }\n    },\n    {\n      "file": "example3.json",\n      "params": { // GET /v1/router?a=1&a=2&a=3&a=4\n        "a": [1, 2, 3, 4]\n      }\n    },\n    {\n      "file": "example4.json",\n      "params": { // Regular expression configruation for matching params\n        "a": { // GET /v1/router?a=1 OR /v1/router?a=2 OR /v1/router?a=3\n            pattern: "1|2|3",\n            flags: "i" // Javascript regex flags to ignore case\n        }\n      }\n    },\n  ]\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"post-params",children:"POST Params"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route6": {\n  "file": "example1.json", // all GET|PUT|DELETE requests\n  "post": [\n    {\n      "file": "example2.json",\n      "params": { // POST with JSON payload {"a": 1}\n        "a": 1\n      }\n    },\n    {\n      "file": "example3.json",\n      "params": { // POST with JSON payload {a: {b: {c: "1"} } }\n        "a.b.c": 1 // nested attributes supported\n      }\n    },\n    {\n      "file": "example4.json",\n      "params": { // POST with JSON payload {a : {b: [0,1,2] } }\n        "a.b[2]": 2 // nested array attributes supported\n      }\n    }\n  ]\n},\n'})}),"\n",(0,r.jsx)(n.h3,{id:"multipart",children:"Multipart"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-html",children:'<form action="/api/v1/users" method="post" enctype="multipart/form-data">\n    <p><input type="text" name="a" value="example" /></p>\n    <p>\n        <input type="file" name="b" />\n        \x3c!--the name of the file is used below to match and score the proper response --\x3e\n    </p>\n    <p><button type="submit">Submit</button></p>\n</form>\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route7": {\n  "file": "example1.json", // all GET|PUT|DELETE requests\n  "post": [\n    {\n      "file": "example2.json" // default response if none match below\n    },\n    {\n      "file": "example3.json",\n      "params": { // form submit where form fields a=1 and b="sample.pdf"\n        "a": 1,\n        "b": "sample.pdf"\n      }\n    },\n    {\n      "file": "example4.json",\n      "params": { // form submit where form fields a=2 and b="another.name.jpg"\n        "a": 2,\n        "b": "another.name.jpg"\n      }\n    }\n  ]\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"async-responses",children:"Async Responses"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route8": {\n  "file": "example1.json",\n  "get": [\n    {\n      "file": "example1.json",\n      "response": [\n        {\n          // first GET request to /v1/route8\n          "status": 202,\n          "file": "example1.json"\n        },\n        {\n          // second GET request to /v1/route8\n          "status": 201,\n          "file": "example2.json"\n        }\n      ]\n    }\n  ]\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"async-responses-with-repeat-option",children:"Async Responses with Repeat Option"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route10": {\n    "get": [\n      {\n        "file": "example1.json",\n        "response": [\n          {\n            "status": 202,\n            "file": "example1.json",\n            "repeat": 3\n          },\n          {\n            "status": 202,\n            "file": "example2.json"\n          },\n          {\n            "status": 202,\n            "file": "example3.json",\n            "repeat": 4\n          },\n          {\n            "status": 201,\n            "file": "example4.json"\n          }\n        ]\n      }\n    ]\n  }\n'})}),"\n",(0,r.jsx)(n.h3,{id:"match-headers",children:"Match Headers"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route11": {\n  "file": "example1.json",\n  "get": [\n    {\n      "file": "example2.json",\n      "headers": { // GET with header key-value pair b:2\n        "b": "2"\n      }\n    },\n    {\n      "file": "example3.json",\n      "headers": { // GET with header key-value pair b:3\n        "c": "3"\n      }\n    }\n  ]\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"url-redirect",children:"Url Redirect"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'"v1/route9": {\n  "url": "http://www.google.com"\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["If you omit the port, or set it to ",(0,r.jsx)(n.code,{children:"0"}),", ",(0,r.jsx)(n.code,{children:"@availity/mock-server"})," will let the OS assign a random open port.\nThis allows you to run multiple servers without keeping track of all ports being used. (see Example 2)"]}),"\n",(0,r.jsx)(n.h2,{id:"acknowledgements",children:"Acknowledgements"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://github.com/gstroup/apimocker",children:"apimocker"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://github.com/typicode/json-server",children:"json-server"})}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},3023:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>o});var r=s(3696);const a={},t=r.createContext(a);function i(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);