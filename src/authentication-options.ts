import TokenTypes from './introspection/token-types';
import { SupportedTokens } from './models/supported-tokens.model';

export default class AuthenticationOption {
    constructor(
        public authority: string,
        public apiName: string = "",
        public apiSecret: string = "",
        public supportedTokens: SupportedTokens = SupportedTokens.Both,
        public tokenTypeHint: string = TokenTypes.AccessToken,
        public enableCache: boolean = false,
        public cacheDuration: number = 600) {
    }
}