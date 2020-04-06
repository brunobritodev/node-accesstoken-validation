import { equal } from 'assert';
import chai, { expect } from 'chai';
import fs from 'fs';
import { JWK, JWKS, JWT } from 'jose';
import { describe } from 'mocha';
import nock from 'nock';
import path from 'path';
import sinon from 'sinon';

import AccessTokenHandler from '../src/access-token-handler';
import { SupportedTokens } from '../src/models/supported-tokens.model';

const jws = "bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjlXVFR1Nm9nZzQyamR2WUpaTUZRYXciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODU5NTA3MzMsImV4cCI6MTU4NTk1NDMzMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImpwX2FwaSIsImNsaWVudF9pZCI6IklTNC1BZG1pbiIsInN1YiI6IjA5MDRlNzVlLTQxM2QtNDg2MC05MzI5LWIyNTg3MjQ3MDY1YSIsImF1dGhfdGltZSI6MTU4NTcyMzY3NSwiaWRwIjoibG9jYWwiLCJpczQtcmlnaHRzIjoibWFuYWdlciIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJiaGRlYnJpdG9AZ21haWwuY29tIiwidXNlcm5hbWUiOiJicnVubyIsInNjb3BlIjpbInJvbGUiLCJlbWFpbCIsInByb2ZpbGUiLCJvcGVuaWQiLCJqcF9hcGkuaXM0Il0sImFtciI6WyJwd2QiXX0.S8fc_c1V887By0gJoYk0Neoeh1OvbHJdNiAzNOMhWaSVxAymdahRTsCCf-43XHiDzP4cyT9K6CdGZbU_z7l7UQ";
const assert = chai.assert;
const refToken = 'bearer zSh5whhIi4vTLkG_A-am3RzZeZhJAhPHto-mFCAigp0';

afterEach(() => {
    sinon.restore();
});

const authority = 'https://localhost:5000';
const jwks_uri = '/.well-known/openid-configuration/jwks';
const introspect = '/connect/introspect';
const discoveryDocument = '/.well-known/openid-configuration';

beforeEach(function () {
    nock.cleanAll();
    nock(authority)
        .get(jwks_uri)
        .replyWithFile(200, path.join(__dirname, 'jwks.json'));

    nock(authority)
        .get(discoveryDocument)
        .replyWithFile(200, path.join(__dirname, 'well-known.json'));

    nock(authority)
        .post(introspect)
        .replyWithFile(200, path.join(__dirname, 'introspection-response.json'));
});

/// I use this tests for development only. I'm quite new at node. In future I'll provide mock
describe('Reference Token', async () => {

    it('Should accept reference token', async () => {

        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "jp_api",
            apiSecret: "teste",
            requireHttpsMetadata: true
        });

        let token = await atHandler.Handle(refToken);

        expect(token.active).be.true;
    });

    it('Should not accept reference token', async () => {
        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "jp_api",
            apiSecret: "teste",
            requireHttpsMetadata: true,
            SupportedTokens: SupportedTokens.Jwt
        });

        try {
            await atHandler.Handle(refToken);
        } catch (error) {
            assert.equal(error.description, "Not supported token type");
        }
    });

});

describe('JWT Bearer Token', () => {

    it('Should validate Bearer Token', async () => {

        var test: any = JWT.decode(jws.replace('bearer ', ''));
        sinon.stub(JWT, 'verify').returns(test);

        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "jp_api",
            apiSecret: "teste",
            requireHttpsMetadata: true
        });
        let token = await atHandler.Handle(jws);

        expect(token).be.not.null;
        sinon.verify();
        sinon.restore();
    });

    it('Should not accept JWT Token', async () => {

        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "jp_api",
            supportedTokens: SupportedTokens.Reference
        });
        let token = await atHandler.Handle(jws);

        expect(token).be.not.null;
        sinon.verify();
        sinon.restore();
    });

    it('Should not accept http when require https', async () => {

        var test: any = JWT.decode(jws.replace('bearer ', ''));
        sinon.stub(JWT, 'verify').returns(test);

        try {
            let atHandler = new AccessTokenHandler({
                authority: authority.replace('https', 'http'),
                apiName: "jp_api",
                requireHttpsMetadata: true
            });
        } catch (error) {
            equal(error.description, 'HTTPS required');
        }

        sinon.verify();
        sinon.restore();
    });

    it('Should get token from Cache', async () => {
        const newJws = 'bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjlXVFR1Nm9nZzQyamR2WUpaTUZRYXciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODYwNDE3MzAsImV4cCI6MTU4NjA0NTMzMCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImpwX2FwaSIsImNsaWVudF9pZCI6IklTNC1BZG1pbiIsInN1YiI6IjA5MDRlNzVlLTQxM2QtNDg2MC05MzI5LWIyNTg3MjQ3MDY1YSIsImF1dGhfdGltZSI6MTU4NTcyMzY3NSwiaWRwIjoibG9jYWwiLCJpczQtcmlnaHRzIjoibWFuYWdlciIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJiaGRlYnJpdG9AZ21haWwuY29tIiwidXNlcm5hbWUiOiJicnVubyIsInNjb3BlIjpbInJvbGUiLCJlbWFpbCIsInByb2ZpbGUiLCJvcGVuaWQiLCJqcF9hcGkuaXM0Il0sImFtciI6WyJwd2QiXX0.DVRwJ2Q81pfkVg2QBHv9S4A1C_gpTnroSA7FJVX70h_ARZkhpLviFS6lrXDEmUZz_0GIk_iibZkOXGFbO7MX7w';
        var test: any = JWT.decode(newJws.replace('bearer ', ''));
        sinon.stub(JWT, 'verify').returns(test);


        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "jp_api",
            requireHttpsMetadata: true
        });

        let jwtHandle = sinon.spy(atHandler, 'checkJwtToken');
        await atHandler.Handle(newJws);
        await atHandler.Handle(newJws);

        assert(jwtHandle.calledOnce);
        sinon.verify();
        sinon.restore();
    });

    
    it('Should accept audience as array', async () => {
        const newJws = 'bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Imx2b2wtSi11S1p4X2hUTk5PTEctNnciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODYxOTI4MTcsImV4cCI6MTU4NjE5NjQxNywiaXNzIjoiaHR0cHM6Ly9zc28uaG1sLmRpZ2l0YWwtc2VndXJvc3VuaW1lZC5jb20iLCJhdWQiOlsiYXBpLXNhdWRlIiwiYXBpLXZpZGEiLCJhcGktb2RvbnRvIiwiYXBpLXByZXYiLCJhcGktcmUiLCJhcGktcG9ydGFscGoiXSwiY2xpZW50X2lkIjoiY2xpZW50LXRlc3RlIiwic3ViIjoiMTdkNWRlZmQtMGFmOC00NDBjLThmYzQtZjc1YjI4MGJkYThjIiwiYXV0aF90aW1lIjoxNTg1MTU3NDU0LCJpZHAiOiJsb2NhbCIsInNhdWRlIjpbInBqLXNhdWRlLXBhZHJhbyIsInBqLXNhdWRlLW1vdmkiXSwicG9ydGFscGoiOiJ0ZXN0ZSIsIm5hbWUiOiJkYW5pZWwuYW1hcmFsIiwic29jaWFsX251bWJlciI6IjQwMDE4NDg0MDAwMTEwIiwic2NvcGUiOlsicHJvZmlsZSIsIm9wZW5pZCIsInNhdWRlLXBhZHJhbyIsInNhdWRlLW1vdmkiLCJzYXVkZS1zZWJyYWUiLCJzYXVkZS12aXZvIiwidmlkYS1wYWRyYW8iLCJvZG9udG8tcGFkcmFvIiwicHJldi1wYWRyYW8iLCJyZS1wYWRyYW8iLCJwb3J0YWxwai1wYWRyYW8iXSwiYW1yIjpbInB3ZCJdfQ.dZIDQ33-8OQFEapnU46KGjV1OnIbdt6dogkmBf3EW0PXi1TTD6E1WsL7Ox7ExqboiVANjBwV5VCq9HE1vLxCvg';
        var test: any = JWT.decode(newJws.replace('bearer ', ''));
        sinon.stub(JWT, 'verify').returns(test);


        let atHandler = new AccessTokenHandler({
            authority: authority,
            apiName: "api-saude",
            requireHttpsMetadata: true
        });

        let jwtHandle = sinon.spy(atHandler, 'checkJwtToken');
        await atHandler.Handle(newJws);
        await atHandler.Handle(newJws);

        assert(jwtHandle.calledOnce);
        sinon.verify();
        sinon.restore();
    });
});
