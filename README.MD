# Node JS - OAuth 2.0 -  Access Token Validation

[![npm version](https://badge.fury.io/js/node-accesstoken-validation.svg)](https://badge.fury.io/js/node-accesstoken-validation)


Authentication handler for node that allows accepting both JWTs and reference tokens (Introspection). 


## Install

```
$ npm install --save node-accesstoken-validation
```

## JWT Usage

Simply specify authority and API name (aka audience):

```typescript

import { AccessTokenHandler } from 'node-accesstoken-validation';


var at_validation = new AccessTokenHandler({
    authority: 'https://localhost:5000',
    apiName: "<api name>
});

at_validation.Handle('bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjlXVFR1Nm9nZzQyamR2WUpaTUZRYXciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODU5NDI5MjIsImV4cCI6MTU4NTk0NjUyMiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImpwX2FwaSIsImNsaWVudF9pZCI6IklTNC1BZG1pbiIsInN1YiI6IjA5MDRlNzVlLTQxM2QtNDg2MC05MzI5LWIyNTg3MjQ3MDY1YSIsImF1dGhfdGltZSI6MTU4NTcyMzY3NSwiaWRwIjoibG9jYWwiLCJpczQtcmlnaHRzIjoibWFuYWdlciIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJiaGRlYnJpdG9AZ21haWwuY29tIiwidXNlcm5hbWUiOiJicnVubyIsInNjb3BlIjpbInJvbGUiLCJlbWFpbCIsInByb2ZpbGUiLCJvcGVuaWQiLCJqcF9hcGkuaXM0Il0sImFtciI6WyJwd2QiXX0.IXXE3P1lU5a_G4uMdVuilpej4E6inlV7ObOprszbyZbjnoS2gwOyegB3WSAjwsbTmzGM-T9_SgLhVP-lqJ94mg').then(console.log).catch(console.warn);

```

## Enable reference tokens
Additionally specify the API secret for the introspection endpoint:

```typescript

import { AccessTokenHandler } from 'node-accesstoken-validation';

var at_validation = new AccessTokenHandler({
    authority: 'https://localhost:5000',
    apiName: "<api name>",
    apiSecret: "<api secret>"
});

at_validation.Handle('bearer z5RuNoKkZQ1cAwstP7ZhHAV8NcmljulxPHzOvNuIRLQ').then(console.log).catch(console.warn);
```

## Scope validation
In addition to API name checking, you can do more fine-grained scope checks.

```typescript
    at_validation.Handle('bearer <bearer>').then(claims => {
        if(claims["custom_claims"] != "custom_value")
            throw new Error();

        //...
    }).catch(console.warn):
```

## Cache response

By default response stay cached by 5 minutes (300 sec). You can change or disable.


```typescript

var at_validation = new AccessTokenHandler({
    authority: 'https://localhost:5000',
    apiName: "<api name>",
    apiSecret: "<api secret>",
    enableCache: true,
    cacheDuration: 300
});

at_validation.Handle('bearer <bearer>').then(console.log).catch(console.warn);
```

## Restrict token type

You can explicit disable JWT or Reference tokens.


```typescript

var at_validation = new AccessTokenHandler({
    authority: 'https://localhost:5000',
    supportedTokens = SupportedTokens.Jwt
});

at_validation.Handle('bearer <bearer>').then(console.log).catch(console.warn);
```

## Audience

By default it checks audience. If you are running through API Gateway and validating many requests disable it.

```typescript

var at_validation = new AccessTokenHandler({
    authority: 'https://localhost:5000',
    apiName: '<api name>'
    checkAudience = false;
});

at_validation.Handle('bearer <bearer>').then(console.log).catch(console.warn);
```

# License

Node Access Token Validation is Open Source software and is released under the MIT license. This license allow the use of Node Access Token Validation in free and commercial applications and libraries without restrictions.
