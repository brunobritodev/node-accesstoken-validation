export default class JwtBearerOptions {
    constructor(
        
        /// <summary>
        /// Gets or sets the Authority to use when making OpenIdConnect calls.
        /// </summary>
        public authority: string,
        /// <summary>
        /// Gets or sets if HTTPS is required for the metadata address or authority.
        /// The default is true. This should be disabled only in development environments.
        /// </summary>
        public requireHttpsMetadata = true,


        /// <summary>
        /// Gets or sets the audience for any received OpenIdConnect token.
        /// </summary>
        /// <value>
        /// The expected audience for any received OpenIdConnect token.
        /// </value>
        public audience: string = "",

       
        public checkAudience: boolean = true) { }
}