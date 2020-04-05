import axios from 'axios';
import jose, { JWKS } from 'jose';
import validUrl from 'valid-url';

import OidcConstants from '../introspection/oidc-constants';
import DiscoveryDocumentResponse from './discovery-document-response';
import DiscoveryError from './discovery.error';


export default class ClientDiscovery {

    /**
     * Load discovery document. .well-known
     */
    public static async loadDiscoveryDocument(authority: string) {
        if (!validUrl.isUri(authority))
            throw new DiscoveryError(authority, "Invalid uri");

        var discoveryDocument = DiscoveryDocumentResponse.getInstance();
        if (discoveryDocument != undefined && discoveryDocument.loaded)
            return;
        
        return axios.get(this.getDiscoveryUrl(authority)).then(response => {
            let instance = response.data;
            let keystore = new JWKS.KeyStore();
            instance = Object.assign({ loaded: true, KeySet: keystore }, instance);
            DiscoveryDocumentResponse.saveInstance(instance);
        });
    }

    /**
     * Load public keys from jwks_uri
     */
    public static async loadJsonWebKeySet(authority: string) {

        var discoveryDocument = DiscoveryDocumentResponse.getInstance();
        if (discoveryDocument == undefined || !discoveryDocument.loaded)
            await this.loadDiscoveryDocument(authority);

        // Reload from cache
        discoveryDocument = DiscoveryDocumentResponse.getInstance();
        
        return axios.get<{ keys: [] }>(discoveryDocument.jwks_uri).then(response => {

            const keys = response.data.keys.map(key => jose.JWK.asKey(key));
            keys.forEach(k => discoveryDocument.KeySet.add(k));

            DiscoveryDocumentResponse.saveInstance(discoveryDocument);
        });
    }

    private static getDiscoveryUrl(authority: string) {
        let url = this.removeTrailingSlash(authority);

        if (url.endsWith(OidcConstants.DiscoveryEndpoint)) {
            return authority;
        }

        return `${url}/${OidcConstants.DiscoveryEndpoint}`;
    }

    private static removeTrailingSlash(term: string) {

        if (term != null && term.endsWith("/"))
            term = term.substring(0, term.length - 1);

        return term;
    }
}
