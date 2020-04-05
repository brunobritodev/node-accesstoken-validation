import https from 'https';

import accessTokenHandler from './access-token-handler';
import AuthenticationOptions from './authentication-options';

require('dotenv').config({ path: __dirname + '/.env' });


https.globalAgent.options.rejectUnauthorized =  process.env.rejectUnauthorized == "true";

var at_validation = new accessTokenHandler({
    authority: 'https://sso.jpproject.net',
    apiName: "<api name>",
    apiSecret: "<api secret>",
});

at_validation.Handle('bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjlXVFR1Nm9nZzQyamR2WUpaTUZRYXciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODU5NTA3MzMsImV4cCI6MTU4NTk1NDMzMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImpwX2FwaSIsImNsaWVudF9pZCI6IklTNC1BZG1pbiIsInN1YiI6IjA5MDRlNzVlLTQxM2QtNDg2MC05MzI5LWIyNTg3MjQ3MDY1YSIsImF1dGhfdGltZSI6MTU4NTcyMzY3NSwiaWRwIjoibG9jYWwiLCJpczQtcmlnaHRzIjoibWFuYWdlciIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJiaGRlYnJpdG9AZ21haWwuY29tIiwidXNlcm5hbWUiOiJicnVubyIsInNjb3BlIjpbInJvbGUiLCJlbWFpbCIsInByb2ZpbGUiLCJvcGVuaWQiLCJqcF9hcGkuaXM0Il0sImFtciI6WyJwd2QiXX0.S8fc_c1V887By0gJoYk0Neoeh1OvbHJdNiAzNOMhWaSVxAymdahRTsCCf-43XHiDzP4cyT9K6CdGZbU_z7l7UQ').then(console.log).catch(console.warn);