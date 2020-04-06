import { isArray } from 'util';

export default class TokenValidation{

    
    public static hasClaims(claims: any, key: string, value: string) {

        var foundClaims = claims[key];
        if (foundClaims != null) {
            if (isArray(foundClaims)) {
                return foundClaims.find(f => f == value);
            }

            return foundClaims == value;
        }
        
        return false;
    }
}