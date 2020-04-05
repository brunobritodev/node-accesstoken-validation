import Axios, { AxiosRequestConfig } from 'axios';
import url_parser from 'url';

import ClientDiscovery from '../discovery/client-discovery';
import DiscoveryDocumentResponse from '../discovery/discovery-document-response';
import IntrospectionError from './introspection.error';
import OAuth2IntrospectionOptions from './oauth2-introspection-options';



export default class OAuth2IntrospectionHandler {

    constructor(public options: OAuth2IntrospectionOptions) {

        if (!this.isSecureScheme(this.options.authority)) {
            throw new IntrospectionError(options.authority, "HTTPS required");
        }
        if (options.clientId == "" || options.clientSecret == "")
            throw new IntrospectionError(options.authority, "Invalid clientId or clientSecret for introspection.");
    }

    public async Introspect(token: string) {

        await ClientDiscovery.loadDiscoveryDocument(this.options.authority);

        const authorizationHeader = `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString('base64')}`;
        const fetchOption: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                Authorization: authorizationHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'token-introspection',
            }
        };
        var params = new URLSearchParams();
        params.append('token', token);
        params.append('token_type_hint', this.options.tokenTypeHint);
        
        var discoveryDocument = DiscoveryDocumentResponse.getInstance();

        let res;
        try {
            const request = Axios.create(fetchOption);
            res = await request.post(discoveryDocument.introspection_endpoint, params);
        }
        catch (err) {
            throw new IntrospectionError(this.options.authority, 'Remote introspection request failed');
        }
        if (res.status === 200 && res.data.active) {
            return res.data;
        }

        throw new IntrospectionError(this.options.authority, 'Token not active');
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
