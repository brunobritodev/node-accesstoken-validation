import { JWKS } from 'jose';
import NodeCache from 'node-cache';

const myCache = new NodeCache({useClones: false});
export default class DiscoveryDocumentResponse {

    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    jwks_uri: string;
    scopes_supported: string[];
    response_types_supported: string[];
    grant_types_supported: string[];
    subject_types_supported: string[];
    id_token_signing_alg_values_supported: string[];
    id_token_encryption_alg_values_supported: string[];
    id_token_encryption_enc_values_supported: string[];
    token_endpoint_auth_methods_supported: string[];
    token_endpoint_auth_signing_alg_values_supported: string[];
    claims_parameter_supported: boolean;
    request_parameter_supported: boolean;
    request_uri_parameter_supported: boolean;
    device_authorization_endpoint: string;
    introspection_endpoint: string;
    revocation_uEndpoint: string;
    KeySet: JWKS.KeyStore;

    public loaded: boolean;

    public static getInstance() {
        var instance = myCache.get<DiscoveryDocumentResponse>("DiscoveryDocument");
        if (instance == undefined) {
            instance = new DiscoveryDocumentResponse();
            instance.loaded = false;

            myCache.set<DiscoveryDocumentResponse>("DiscoveryDocument", instance, 600);
        }
        return instance;
    }

    public static saveInstance(instance: DiscoveryDocumentResponse) {
        myCache.set<DiscoveryDocumentResponse>("DiscoveryDocument", instance, 600);
    }
}

