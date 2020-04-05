import NodeCache from 'node-cache';

import AuthenticationOptions from './authentication-options';
import IAuthenticationOptions from './authentication-options';
import InvalidTokenError from './errors/invalid-token-error';
import OAuth2IntrospectionHandler from './introspection/oauth2-introspection-handler';
import OAuth2IntrospectionOptions from './introspection/oauth2-introspection-options';
import TokenTypes from './introspection/token-types';
import JwtBearerOptions from './jwt-token/jwt-bearer-options';
import JwtTokenHandler from './jwt-token/jwt-token-handler';
import { SupportedTokens } from './models/supported-tokens.model';
import TokenRetriever from './token.retriever';

const myCache = new NodeCache({ useClones: false });

export default class AccessTokenHandler {

    private tokenIntrospectionOptions: OAuth2IntrospectionOptions;
    private introspectionHandler: OAuth2IntrospectionHandler;
    private jwtTokenHandler: JwtTokenHandler;
    private options: AuthenticationOptions;
    constructor(
        {
            authority,
            apiName = "",
            apiSecret = "",
            requireHttpsMetadata = true,
            supportedTokens = SupportedTokens.Both,
            tokenTypeHint = TokenTypes.AccessToken,
            enableCache = true,
            cacheDuration = 300,
            checkAudience = true
        }: any) {

        this.options = new AuthenticationOptions(authority, apiName, apiSecret, supportedTokens, tokenTypeHint, enableCache, cacheDuration);
        this.jwtTokenHandler = new JwtTokenHandler(new JwtBearerOptions(authority, requireHttpsMetadata, apiName, checkAudience));

        if (apiSecret === "") {
            this.options.supportedTokens = SupportedTokens.Jwt;
            return;
        }
        if (apiName === "")
            throw new Error('apiName must be configured if ApiSecret is set.');

        this.tokenIntrospectionOptions = new OAuth2IntrospectionOptions(authority, apiName, apiSecret, requireHttpsMetadata, tokenTypeHint, enableCache, cacheDuration);
        this.introspectionHandler = new OAuth2IntrospectionHandler(this.tokenIntrospectionOptions);
    }

    /**
     * Method to handle bearer token. If success, return the payload.
     */
    public async Handle(authorization: string, scheme: string = "bearer") {
        const token = TokenRetriever.Retrieve(authorization, scheme);

        if (token == null) {
            throw new InvalidTokenError(this.options.authority, "Token not found", token);
        }

        const tokenType = TokenRetriever.FindType(token);
        if (!this.supportThisToken(tokenType))
            throw new InvalidTokenError(this.options.authority, "Not supported token type", token);

        if (this.options.enableCache) {
            var responseCached = myCache.get(token);
            if (responseCached != undefined)
                return responseCached;
        }

        
        if (tokenType == SupportedTokens.Reference) {
            return this.checkReferenceToken(token);
        }

        if (tokenType == SupportedTokens.Jwt) {
            return this.checkJwtToken(token);
        }
    }

    public async checkReferenceToken(token: string) {
        var response = await this.introspectionHandler.Introspect(token);
        this.saveCache(token, response);

        return response;
    }

    public checkJwtToken(token: string) {
        var response = this.jwtTokenHandler.Handle(token);
        this.saveCache(token, response);

        return response;
    }

    private saveCache(token: string, response: any) {
        if (this.options.enableCache)
            myCache.set(token, response, this.options.cacheDuration);
    }

    private supportThisToken(tokenType: SupportedTokens) {
        if (this.options.supportedTokens == SupportedTokens.Both)
            return true;

        return tokenType == this.options.supportedTokens;
    }
}