export default class InvalidTokenError extends Error {
    constructor(
        public authority: string,
        public description: string,
        public token: string,
        public errorCode: string = "invalid_token") {
        super(errorCode);
        Error.captureStackTrace(this, InvalidTokenError);
    }
}