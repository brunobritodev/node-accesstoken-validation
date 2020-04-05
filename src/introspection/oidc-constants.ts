export default class OidcConstants {

    public static Issuer = "issuer";
    // endpoints
    public static AuthorizationEndpoint = "authorization_endpoint";
    public static DeviceAuthorizationEndpoint = "device_authorization_endpoint";
    public static TokenEndpoint = "token_endpoint";
    public static UserInfoEndpoint = "userinfo_endpoint";
    public static IntrospectionEndpoint = "introspection_endpoint";
    public static RevocationEndpoint = "revocation_endpoint";
    public static DiscoveryEndpoint = ".well-known/openid-configuration";
    public static JwksUri = "jwks_uri";
    public static EndSessionEndpoint = "end_session_endpoint";
    public static CheckSessionIframe = "check_session_iframe";
    public static RegistrationEndpoint = "registration_endpoint";
    public static MtlsEndpointAliases = "mtls_endpoint_aliases";
    // common capabilities
    public static FrontChannelLogoutSupported = "frontchannel_logout_supported";
    public static FrontChannelLogoutSessionSupported = "frontchannel_logout_session_supported";
    public static BackChannelLogoutSupported = "backchannel_logout_supported";
    public static BackChannelLogoutSessionSupported = "backchannel_logout_session_supported";
    public static GrantTypesSupported = "grant_types_supported";
    public static CodeChallengeMethodsSupported = "code_challenge_methods_supported";
    public static ScopesSupported = "scopes_supported";
    public static SubjectTypesSupported = "subject_types_supported";
    public static ResponseModesSupported = "response_modes_supported";
    public static ResponseTypesSupported = "response_types_supported";
    public static ClaimsSupported = "claims_supported";
    public static TokenEndpointAuthenticationMethodsSupported = "token_endpoint_auth_methods_supported";
    // more capabilities
    public static ClaimsLocalesSupported = "claims_locales_supported";
    public static ClaimsParameterSupported = "claims_parameter_supported";
    public static ClaimTypesSupported = "claim_types_supported";
    public static DisplayValuesSupported = "display_values_supported";
    public static AcrValuesSupported = "acr_values_supported";
    public static IdTokenEncryptionAlgorithmsSupported = "id_token_encryption_alg_values_supported";
    public static IdTokenEncryptionEncValuesSupported = "id_token_encryption_enc_values_supported";
    public static IdTokenSigningAlgorithmsSupported = "id_token_signing_alg_values_supported";
    public static OpPolicyUri = "op_policy_uri";
    public static OpTosUri = "op_tos_uri";
    public static RequestObjectEncryptionAlgorithmsSupported = "request_object_encryption_alg_values_supported";
    public static RequestObjectEncryptionEncValuesSupported = "request_object_encryption_enc_values_supported";
    public static RequestObjectSigningAlgorithmsSupported = "request_object_signing_alg_values_supported";
    public static RequestParameterSupported = "request_parameter_supported";
    public static RequestUriParameterSupported = "request_uri_parameter_supported";
    public static RequireRequestUriRegistration = "require_request_uri_registration";
    public static ServiceDocumentation = "service_documentation";
    public static TokenEndpointAuthSigningAlgorithmsSupported = "token_endpoint_auth_signing_alg_values_supported";
    public static UILocalesSupported = "ui_locales_supported";
    public static UserInfoEncryptionAlgorithmsSupported = "userinfo_encryption_alg_values_supported";
    public static UserInfoEncryptionEncValuesSupported = "userinfo_encryption_enc_values_supported";
    public static UserInfoSigningAlgorithmsSupported = "userinfo_signing_alg_values_supported";
    public static TlsClientCertificateBoundAccessTokens = "tls_client_certificate_bound_access_tokens";

}