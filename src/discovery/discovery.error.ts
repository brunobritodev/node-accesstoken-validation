export default class DiscoveryError extends Error {
    constructor(
        public authority: string,
        public description: string,
        public errorCode: string = "invalid_discovery") {
        super(errorCode);
        Error.captureStackTrace(this, DiscoveryError);
    }

    
}