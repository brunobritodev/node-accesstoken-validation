export default class IntrospectionError extends Error {
    constructor(
        public authority: string,
        public description: string,
        public errorCode: string = "invalid_introspection") {
        super(errorCode);
        Error.captureStackTrace(this, IntrospectionError);
    }

    
}