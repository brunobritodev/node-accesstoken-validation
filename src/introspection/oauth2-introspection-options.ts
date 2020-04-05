import TokenTypes from './token-types';

export default class OAuth2IntrospectionOptions{
    constructor(
        public authority: string,
        public clientId: string,
        public clientSecret: string,
        public requireHttpsMetadata: boolean = true,
        public tokenTypeHint = TokenTypes.AccessToken,
        public enableCache: boolean = false,
        public cacheDuration: number = 600) {

        if (clientId === "")
            return;

        if (clientSecret === "")
            throw new Error('clientId must be configured if clientSecret is set.');
    }
}