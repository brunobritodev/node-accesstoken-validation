import { SupportedTokens } from './models/supported-tokens.model';

export default class TokenRetriever {

    public static Retrieve(authorization: string, scheme: string = "bearer") {

        if (authorization == null || authorization.trim() == "")
            return null;

        if (authorization.toLowerCase().startsWith(scheme))
            return authorization.substring(`${scheme}`.length + 1).trim();

        return null;
    }

    public static FromAuthorizationHeader(request: any, scheme: string = "bearer") {
        const authorization = request.headers["authorization"].toString().toLower();
        return this.Retrieve(authorization);
    }

    public static FindType(token: string) {
        if (token.includes("."))
            return SupportedTokens.Jwt;

        return SupportedTokens.Reference;
    }
}
