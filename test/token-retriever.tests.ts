import chai, { expect } from 'chai';
import https from 'https';

import TokenRetriever from '../src/token.retriever';

const jws = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjlXVFR1Nm9nZzQyamR2WUpaTUZRYXciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODU3MjMyNDYsImV4cCI6MTU4NTcyNjg0NiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImpwX2FwaSIsImNsaWVudF9pZCI6IklTNC1BZG1pbiIsInN1YiI6IjA5MDRlNzVlLTQxM2QtNDg2MC05MzI5LWIyNTg3MjQ3MDY1YSIsImF1dGhfdGltZSI6MTU4NTUyODczNCwiaWRwIjoibG9jYWwiLCJpczQtcmlnaHRzIjoibWFuYWdlciIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJiaGRlYnJpdG9AZ21haWwuY29tIiwidXNlcm5hbWUiOiJicnVubyIsInNjb3BlIjpbInJvbGUiLCJlbWFpbCIsInByb2ZpbGUiLCJvcGVuaWQiLCJqcF9hcGkuaXM0Il0sImFtciI6WyJwd2QiXX0.uIXwj7hSOrTJIlUJxelBm9hM9vXSXEtLI3eMbc81VVIW5oSzTfVb39S-I67zCNfLCi4V-hD1_qBa7jdtI_mgmg";
const assert = chai.assert;
// it works
https.globalAgent.options.rejectUnauthorized =  process.env.rejectUnauthorized == "true";

describe('TokenRetriever', () => {
    it('Should return null when bearer not found', () => {
        assert.isNull(TokenRetriever.Retrieve("aoeua euo ao", "bearer"))
    });
    
    it('Should return Bearer token', () => {
        const foundToken =TokenRetriever.Retrieve(`Bearer ${jws}`);
        expect(foundToken).not.to.be.null;
    });

    it('Should token same JWS', () => {
        const foundToken =TokenRetriever.Retrieve(`Bearer ${jws}`);
        assert.equal(jws, foundToken);
    });
    
});
