import { JWT } from 'jose';
import url_parser from 'url';

import ClientDiscovery from '../discovery/client-discovery';
import DiscoveryDocumentResponse from '../discovery/discovery-document-response';
import InvalidTokenError from '../errors/invalid-token-error';
import JwtBearerOptions from './jwt-bearer-options';

export default class JwtTokenHandler {


    constructor(public options: JwtBearerOptions) {
        if (!this.isSecureScheme(this.options.authority)) {
            throw new InvalidTokenError(options.authority, "HTTPS required", null);
        }
    }

    /**
     * Validate JWT (In fact JWS)
     */
    public async Handle(token: string) {

        if (!this.isSecureScheme(token))

            await ClientDiscovery.loadJsonWebKeySet(this.options.authority);

        var discoveryDocument = DiscoveryDocumentResponse.getInstance();
        var claims = JWT.verify(token, discoveryDocument.KeySet);

        if (!this.options.checkAudience)
            return claims;

        if (this.hasClaims(claims, "aud", this.options.audience))
            return claims;

        throw new InvalidTokenError(this.options.authority, `Failed to validate the token. Audience validation failed: ${this.options.audience}`, token);
    }


    private hasClaims(claims: any, key: string, value: string) {

        var foundClaims = claims[key] == value;
        if (foundClaims)
            return true;
        return false;
    }
    /// <summary>
    /// Determines whether uses a secure scheme according to the policy.
    /// </summary>
    private isSecureScheme(url: string) {
        if (this.options.requireHttpsMetadata) {
            var parsedUrl = url_parser.parse(url);
            return parsedUrl.protocol === "https:";
        }

        return true;
    }
}

