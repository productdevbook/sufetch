/* eslint-disable */
declare module 'apiful/schema' {
  import { paths as OpenFGAPaths, components as OpenFGAComponents } from 'apiful/schema/OpenFGA'

  // Augment the schema repository interface with all service schemas
  interface OpenAPISchemaRepository {
    'OpenFGA': OpenFGAPaths
  }

  // Type helpers for schema paths and methods
  type NonNeverKeys<T> = { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
  type PathMethods<T, P extends keyof T> = Exclude<NonNeverKeys<T[P]>, 'parameters'>

  /**
   * OpenAPI endpoint type helper for the OpenFGA API
   *
   * @example
   * // Get path parameters for retrieving a user by ID:
   * type UserParams = OpenFGA<'/users/{id}', 'get'>['path']
   *
   * // Get query parameters for listing users:
   * type UsersQuery = OpenFGA<'/users', 'get'>['query']
   *
   * // Get request body type for creating a user:
   * type CreateUserBody = OpenFGA<'/users', 'post'>['request']
   *
   * // Get success response for retrieving a user:
   * type UserResponse = OpenFGA<'/users/{id}', 'get'>['response']
   *
   * // Get a specific status code response:
   * type UserNotFoundResponse = OpenFGA<'/users/{id}', 'get'>['responses'][404]
   *
   * // Get complete endpoint type definition:
   * type UserEndpoint = OpenFGA<'/users/{id}', 'get'>
   */
  export type OpenFGA<
    Path extends keyof OpenFGAPaths,
    Method extends PathMethods<OpenFGAPaths, Path> = PathMethods<OpenFGAPaths, Path> extends string ? PathMethods<OpenFGAPaths, Path> : never
  > = {
    /** Path parameters for this endpoint */
    path: OpenFGAPaths[Path][Method] extends { parameters?: { path?: infer P } } ? P : Record<string, never>
  
    /** Query parameters for this endpoint */
    query: OpenFGAPaths[Path][Method] extends { parameters?: { query?: infer Q } } ? Q : Record<string, never>
  
    /** Request body for this endpoint */
    request: OpenFGAPaths[Path][Method] extends { requestBody?: { content: { 'application/json': infer R } } } ? R : Record<string, never>
  
    /** Success response for this endpoint (defaults to 200 status code) */
    response: OpenFGAPaths[Path][Method] extends { responses: infer R }
      ? 200 extends keyof R
        ? R[200] extends { content: { 'application/json': infer S } } ? S : Record<string, never>
        : Record<string, never>
      : Record<string, never>
  
    /** All possible responses for this endpoint by status code */
    responses: OpenFGAPaths[Path][Method] extends { responses: infer T }
      ? {
          [Status in keyof T]:
            T[Status] extends { content: { 'application/json': infer R } }
              ? R
              : Record<string, never>
        }
      : Record<string, never>
  
    /** Full path with typed parameters for this endpoint (useful for route builders) */
    fullPath: Path
  
    /** HTTP method for this endpoint */
    method: Method
  
    /**
     * Full operation object for this endpoint
     *
     * @remarks
     * Useful for accessing additional metadata, such as tags or security requirements.
     */
    operation: OpenFGAPaths[Path][Method]
  }
  
  /**
   * Type helper to list all available paths of the OpenFGA API
   *
   * @example
   * type AvailablePaths = OpenFGAApiPaths // Returns literal union of all available paths
   */
  export type OpenFGAApiPaths = keyof OpenFGAPaths
  
  /**
   * Type helper to get available methods for a specific path of the OpenFGA API
   *
   * @example
   * type UserMethods = OpenFGAApiMethods<'/users/{id}'> // Returns 'get' | 'put' | 'delete' etc.
   */
  export type OpenFGAApiMethods<P extends keyof OpenFGAPaths> = PathMethods<OpenFGAPaths, P>
  
  /**
   * Type helper to extract schema models from the OpenFGA API
   *
   * @example
   * type Pet = OpenFGAModel<'Pet'> // Get the Pet schema model
   * type User = OpenFGAModel<'User'> // Get the User schema model
   */
  export type OpenFGAModel<T extends keyof OpenFGAComponents['schemas']> = OpenFGAComponents['schemas'][T]
}

declare module 'apiful/schema/OpenFGA' {
  export interface paths {
    "/.well-known/ory/webauthn.js": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get WebAuthn JavaScript
       * @description This endpoint provides JavaScript which is needed in order to perform WebAuthn login and registration.
       *
       *     If you are building a JavaScript Browser App (e.g. in ReactJS or AngularJS) you will need to load this file:
       *
       *     ```html
       *     <script src="https://public-kratos.example.org/.well-known/ory/webauthn.js" type="script" async />
       *     ```
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["getWebAuthnJavaScript"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/courier/messages": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * List Messages
       * @description Lists all messages by given status and recipient.
       */
      get: operations["listCourierMessages"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/courier/messages/{id}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get a Message
       * @description Gets a specific messages by the given ID.
       */
      get: operations["getCourierMessage"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/identities": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * List Identities
       * @description Lists all [identities](https://www.ory.sh/docs/kratos/concepts/identity-user-model) in the system. Note: filters cannot be combined.
       */
      get: operations["listIdentities"];
      put?: never;
      /**
       * Create an Identity
       * @description Create an [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model).  This endpoint can also be used to
       *     [import credentials](https://www.ory.sh/docs/kratos/manage-identities/import-user-accounts-identities)
       *     for instance passwords, social sign in configurations or multifactor methods.
       */
      post: operations["createIdentity"];
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Create multiple identities
       * @description Creates multiple
       *     [identities](https://www.ory.sh/docs/kratos/concepts/identity-user-model).
       *     This endpoint can also be used to [import
       *     credentials](https://www.ory.sh/docs/kratos/manage-identities/import-user-accounts-identities)
       *     for instance passwords, social sign in configurations or multifactor methods.
       */
      patch: operations["batchPatchIdentities"];
      trace?: never;
    };
    "/admin/identities/{id}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get an Identity
       * @description Return an [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model) by its ID. You can optionally
       *     include credentials (e.g. social sign in connections) in the response by using the `include_credential` query parameter.
       */
      get: operations["getIdentity"];
      /**
       * Update an Identity
       * @description This endpoint updates an [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model). The full identity
       *     payload (except credentials) is expected. It is possible to update the identity's credentials as well.
       */
      put: operations["updateIdentity"];
      post?: never;
      /**
       * Delete an Identity
       * @description Calling this endpoint irrecoverably and permanently deletes the [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model) given its ID. This action can not be undone.
       *     This endpoint returns 204 when the identity was deleted or when the identity was not found, in which case it is
       *     assumed that is has been deleted already.
       */
      delete: operations["deleteIdentity"];
      options?: never;
      head?: never;
      /**
       * Patch an Identity
       * @description Partially updates an [identity's](https://www.ory.sh/docs/kratos/concepts/identity-user-model) field using [JSON Patch](https://jsonpatch.com/).
       *     The fields `id`, `stateChangedAt` and `credentials` can not be updated using this method.
       */
      patch: operations["patchIdentity"];
      trace?: never;
    };
    "/admin/identities/{id}/credentials/{type}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      post?: never;
      /**
       * Delete a credential for a specific identity
       * @description Delete an [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model) credential by its type.
       *     You cannot delete password or code auth credentials through this API.
       */
      delete: operations["deleteIdentityCredentials"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/identities/{id}/sessions": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * List an Identity's Sessions
       * @description This endpoint returns all sessions that belong to the given Identity.
       */
      get: operations["listIdentitySessions"];
      put?: never;
      post?: never;
      /**
       * Delete & Invalidate an Identity's Sessions
       * @description Calling this endpoint irrecoverably and permanently deletes and invalidates all sessions that belong to the given Identity.
       */
      delete: operations["deleteIdentitySessions"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/recovery/code": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Create a Recovery Code
       * @description This endpoint creates a recovery code which should be given to the user in order for them to recover
       *     (or activate) their account.
       */
      post: operations["createRecoveryCodeForIdentity"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/recovery/link": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Create a Recovery Link
       * @description This endpoint creates a recovery link which should be given to the user in order for them to recover
       *     (or activate) their account.
       */
      post: operations["createRecoveryLinkForIdentity"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/sessions": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * List All Sessions
       * @description Listing all sessions that exist.
       */
      get: operations["listSessions"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/sessions/{id}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Session
       * @description This endpoint is useful for:
       *
       *     Getting a session object with all specified expandables that exist in an administrative context.
       */
      get: operations["getSession"];
      put?: never;
      post?: never;
      /**
       * Deactivate a Session
       * @description Calling this endpoint deactivates the specified session. Session data is not deleted.
       */
      delete: operations["disableSession"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/admin/sessions/{id}/extend": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Extend a Session
       * @description Calling this endpoint extends the given session ID. If `session.earliest_possible_extend` is set it
       *     will only extend the session after the specified time has passed.
       *
       *     This endpoint returns per default a 204 No Content response on success. Older Ory Network projects may
       *     return a 200 OK response with the session in the body. Returning the session as part of the response
       *     will be deprecated in the future and should not be relied upon.
       *
       *     This endpoint ignores consecutive requests to extend the same session and returns a 404 error in those
       *     scenarios. This endpoint also returns 404 errors if the session does not exist.
       *
       *     Retrieve the session ID from the `/sessions/whoami` endpoint / `toSession` SDK method.
       */
      patch: operations["extendSession"];
      trace?: never;
    };
    "/health/alive": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Check HTTP Server Status
       * @description This endpoint returns a HTTP 200 status code when Ory Kratos is accepting incoming
       *     HTTP requests. This status does currently not include checks whether the database connection is working.
       *
       *     If the service supports TLS Edge Termination, this endpoint does not require the
       *     `X-Forwarded-Proto` header to be set.
       *
       *     Be aware that if you are running multiple nodes of this service, the health status will never
       *     refer to the cluster state, only to a single instance.
       */
      get: operations["isAlive"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/health/ready": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Check HTTP Server and Database Status
       * @description This endpoint returns a HTTP 200 status code when Ory Kratos is up running and the environment dependencies (e.g.
       *     the database) are responsive as well.
       *
       *     If the service supports TLS Edge Termination, this endpoint does not require the
       *     `X-Forwarded-Proto` header to be set.
       *
       *     Be aware that if you are running multiple nodes of Ory Kratos, the health status will never
       *     refer to the cluster state, only to a single instance.
       */
      get: operations["isReady"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/schemas": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get all Identity Schemas
       * @description Returns a list of all identity schemas currently in use.
       */
      get: operations["listIdentitySchemas"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/schemas/{id}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Identity JSON Schema
       * @description Return a specific identity schema.
       */
      get: operations["getIdentitySchema"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/errors": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get User-Flow Errors
       * @description This endpoint returns the error associated with a user-facing self service errors.
       *
       *     This endpoint supports stub values to help you implement the error UI:
       *
       *     `?id=stub:500` - returns a stub 500 (Internal Server Error) error.
       *
       *     More information can be found at [Ory Kratos User User Facing Error Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-facing-errors).
       */
      get: operations["getFlowError"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/fed-cm/parameters": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get FedCM Parameters
       * @description This endpoint returns a list of all available FedCM providers. It is only supported on the Ory Network.
       */
      get: operations["createFedcmFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/fed-cm/token": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Submit a FedCM token
       * @description Use this endpoint to submit a token from a FedCM provider through
       *     `navigator.credentials.get` and log the user in. The parameters from
       *     `navigator.credentials.get` must have come from `GET
       *     self-service/fed-cm/parameters`.
       */
      post: operations["updateFedcmFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/login": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Submit a Login Flow
       * @description Use this endpoint to complete a login flow. This endpoint
       *     behaves differently for API and browser flows.
       *
       *     API flows expect `application/json` to be sent in the body and responds with
       *     HTTP 200 and a application/json body with the session token on success;
       *     HTTP 410 if the original flow expired with the appropriate error messages set and optionally a `use_flow_id` parameter in the body;
       *     HTTP 400 on form validation errors.
       *
       *     Browser flows expect a Content-Type of `application/x-www-form-urlencoded` or `application/json` to be sent in the body and respond with
       *     a HTTP 303 redirect to the post/after login URL or the `return_to` value if it was set and if the login succeeded;
       *     a HTTP 303 redirect to the login UI URL with the flow ID containing the validation errors otherwise.
       *
       *     Browser flows with an accept header of `application/json` will not redirect but instead respond with
       *     HTTP 200 and a application/json body with the signed in identity and a `Set-Cookie` header on success;
       *     HTTP 303 redirect to a fresh login flow if the original flow expired with the appropriate error messages set;
       *     HTTP 400 on form validation errors.
       *
       *     If this endpoint is called with `Accept: application/json` in the header, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *     `browser_location_change_required`: Usually sent when an AJAX request indicates that the browser needs to open a specific URL.
       *     Most likely used in Social Sign In flows.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      post: operations["updateLoginFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/login/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Login Flow for Native Apps
       * @description This endpoint initiates a login flow for native apps that do not use a browser, such as mobile devices, smart TVs, and so on.
       *
       *     If a valid provided session cookie or session token is provided, a 400 Bad Request error
       *     will be returned unless the URL query parameter `?refresh=true` is set.
       *
       *     To fetch an existing login flow call `/self-service/login/flows?flow=<flow_id>`.
       *
       *     You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
       *     Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
       *     you vulnerable to a variety of CSRF attacks, including CSRF login attacks.
       *
       *     In the case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `session_aal1_required`: Multi-factor auth (e.g. 2fa) was requested but the user has no session yet.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *
       *     This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["createNativeLoginFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/login/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Login Flow for Browsers
       * @description This endpoint initializes a browser-based user login flow. This endpoint will set the appropriate
       *     cookies and anti-CSRF measures required for browser-based flows.
       *
       *     If this endpoint is opened as a link in the browser, it will be redirected to
       *     `selfservice.flows.login.ui_url` with the flow ID set as the query parameter `?flow=`. If a valid user session
       *     exists already, the browser will be redirected to `urls.default_redirect_url` unless the query parameter
       *     `?refresh=true` was set.
       *
       *     If this endpoint is called via an AJAX request, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `session_aal1_required`: Multi-factor auth (e.g. 2fa) was requested but the user has no session yet.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *
       *     The optional query parameter login_challenge is set when using Kratos with
       *     Hydra in an OAuth2 flow. See the oauth2_provider.url configuration
       *     option.
       *
       *     This endpoint is NOT INTENDED for clients that do not have a browser (Chrome, Firefox, ...) as cookies are needed.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["createBrowserLoginFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/login/flows": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Login Flow
       * @description This endpoint returns a login flow's context with, for example, error details and other information.
       *
       *     Browser flows expect the anti-CSRF cookie to be included in the request's HTTP Cookie Header.
       *     For AJAX requests you must ensure that cookies are included in the request or requests will fail.
       *
       *     If you use the browser-flow for server-side apps, the services need to run on a common top-level-domain
       *     and you need to forward the incoming HTTP Cookie header to this endpoint:
       *
       *     ```js
       *     pseudo-code example
       *     router.get('/login', async function (req, res) {
       *     const flow = await client.getLoginFlow(req.header('cookie'), req.query['flow'])
       *
       *     res.render('login', flow)
       *     })
       *     ```
       *
       *     This request may fail due to several reasons. The `error.id` can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `self_service_flow_expired`: The flow is expired and you should request a new one.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["getLoginFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/logout": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Update Logout Flow
       * @description This endpoint logs out an identity in a self-service manner.
       *
       *     If the `Accept` HTTP header is not set to `application/json`, the browser will be redirected (HTTP 303 See Other)
       *     to the `return_to` parameter of the initial request or fall back to `urls.default_return_to`.
       *
       *     If the `Accept` HTTP header is set to `application/json`, a 204 No Content response
       *     will be sent on successful logout instead.
       *
       *     This endpoint is NOT INTENDED for API clients and only works
       *     with browsers (Chrome, Firefox, ...). For API clients you can
       *     call the `/self-service/logout/api` URL directly with the Ory Session Token.
       *
       *     More information can be found at [Ory Kratos User Logout Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-logout).
       */
      get: operations["updateLogoutFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/logout/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      post?: never;
      /**
       * Perform Logout for Native Apps
       * @description Use this endpoint to log out an identity using an Ory Session Token. If the Ory Session Token was successfully
       *     revoked, the server returns a 204 No Content response. A 204 No Content response is also sent when
       *     the Ory Session Token has been revoked already before.
       *
       *     If the Ory Session Token is malformed or does not exist a 403 Forbidden response will be returned.
       *
       *     This endpoint does not remove any HTTP
       *     Cookies - use the Browser-Based Self-Service Logout Flow instead.
       */
      delete: operations["performNativeLogout"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/logout/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create a Logout URL for Browsers
       * @description This endpoint initializes a browser-based user logout flow and a URL which can be used to log out the user.
       *
       *     This endpoint is NOT INTENDED for API clients and only works
       *     with browsers (Chrome, Firefox, ...). For API clients you can
       *     call the `/self-service/logout/api` URL directly with the Ory Session Token.
       *
       *     The URL is only valid for the currently signed in user. If no user is signed in, this endpoint returns
       *     a 401 error.
       *
       *     When calling this endpoint from a backend, please ensure to properly forward the HTTP cookies.
       */
      get: operations["createBrowserLogoutFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/recovery": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Update Recovery Flow
       * @description Use this endpoint to update a recovery flow. This endpoint
       *     behaves differently for API and browser flows and has several states:
       *
       *     `choose_method` expects `flow` (in the URL query) and `email` (in the body) to be sent
       *     and works with API- and Browser-initiated flows.
       *     For API clients and Browser clients with HTTP Header `Accept: application/json` it either returns a HTTP 200 OK when the form is valid and HTTP 400 OK when the form is invalid.
       *     and a HTTP 303 See Other redirect with a fresh recovery flow if the flow was otherwise invalid (e.g. expired).
       *     For Browser clients without HTTP Header `Accept` or with `Accept: text/*` it returns a HTTP 303 See Other redirect to the Recovery UI URL with the Recovery Flow ID appended.
       *     `sent_email` is the success state after `choose_method` for the `link` method and allows the user to request another recovery email. It
       *     works for both API and Browser-initiated flows and returns the same responses as the flow in `choose_method` state.
       *     `passed_challenge` expects a `token` to be sent in the URL query and given the nature of the flow ("sending a recovery link")
       *     does not have any API capabilities. The server responds with a HTTP 303 See Other redirect either to the Settings UI URL
       *     (if the link was valid) and instructs the user to update their password, or a redirect to the Recover UI URL with
       *     a new Recovery Flow ID which contains an error message that the recovery link was invalid.
       *
       *     More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery).
       */
      post: operations["updateRecoveryFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/recovery/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Recovery Flow for Native Apps
       * @description This endpoint initiates a recovery flow for API clients such as mobile devices, smart TVs, and so on.
       *
       *     If a valid provided session cookie or session token is provided, a 400 Bad Request error.
       *
       *     On an existing recovery flow, use the `getRecoveryFlow` API endpoint.
       *
       *     You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
       *     Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
       *     you vulnerable to a variety of CSRF attacks.
       *
       *     This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
       *
       *     More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery).
       */
      get: operations["createNativeRecoveryFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/recovery/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Recovery Flow for Browsers
       * @description This endpoint initializes a browser-based account recovery flow. Once initialized, the browser will be redirected to
       *     `selfservice.flows.recovery.ui_url` with the flow ID set as the query parameter `?flow=`. If a valid user session
       *     exists, the browser is returned to the configured return URL.
       *
       *     If this endpoint is called via an AJAX request, the response contains the recovery flow without any redirects
       *     or a 400 bad request error if the user is already authenticated.
       *
       *     This endpoint is NOT INTENDED for clients that do not have a browser (Chrome, Firefox, ...) as cookies are needed.
       *
       *     More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery).
       */
      get: operations["createBrowserRecoveryFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/recovery/flows": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Recovery Flow
       * @description This endpoint returns a recovery flow's context with, for example, error details and other information.
       *
       *     Browser flows expect the anti-CSRF cookie to be included in the request's HTTP Cookie Header.
       *     For AJAX requests you must ensure that cookies are included in the request or requests will fail.
       *
       *     If you use the browser-flow for server-side apps, the services need to run on a common top-level-domain
       *     and you need to forward the incoming HTTP Cookie header to this endpoint:
       *
       *     ```js
       *     pseudo-code example
       *     router.get('/recovery', async function (req, res) {
       *     const flow = await client.getRecoveryFlow(req.header('Cookie'), req.query['flow'])
       *
       *     res.render('recovery', flow)
       *     })
       *     ```
       *
       *     More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery).
       */
      get: operations["getRecoveryFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/registration": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Update Registration Flow
       * @description Use this endpoint to complete a registration flow by sending an identity's traits and password. This endpoint
       *     behaves differently for API and browser flows.
       *
       *     API flows expect `application/json` to be sent in the body and respond with
       *     HTTP 200 and a application/json body with the created identity success - if the session hook is configured the
       *     `session` and `session_token` will also be included;
       *     HTTP 410 if the original flow expired with the appropriate error messages set and optionally a `use_flow_id` parameter in the body;
       *     HTTP 400 on form validation errors.
       *
       *     Browser flows expect a Content-Type of `application/x-www-form-urlencoded` or `application/json` to be sent in the body and respond with
       *     a HTTP 303 redirect to the post/after registration URL or the `return_to` value if it was set and if the registration succeeded;
       *     a HTTP 303 redirect to the registration UI URL with the flow ID containing the validation errors otherwise.
       *
       *     Browser flows with an accept header of `application/json` will not redirect but instead respond with
       *     HTTP 200 and a application/json body with the signed in identity and a `Set-Cookie` header on success;
       *     HTTP 303 redirect to a fresh login flow if the original flow expired with the appropriate error messages set;
       *     HTTP 400 on form validation errors.
       *
       *     If this endpoint is called with `Accept: application/json` in the header, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *     `browser_location_change_required`: Usually sent when an AJAX request indicates that the browser needs to open a specific URL.
       *     Most likely used in Social Sign In flows.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      post: operations["updateRegistrationFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/registration/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Registration Flow for Native Apps
       * @description This endpoint initiates a registration flow for API clients such as mobile devices, smart TVs, and so on.
       *
       *     If a valid provided session cookie or session token is provided, a 400 Bad Request error
       *     will be returned unless the URL query parameter `?refresh=true` is set.
       *
       *     To fetch an existing registration flow call `/self-service/registration/flows?flow=<flow_id>`.
       *
       *     You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
       *     Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
       *     you vulnerable to a variety of CSRF attacks.
       *
       *     In the case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *
       *     This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["createNativeRegistrationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/registration/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Registration Flow for Browsers
       * @description This endpoint initializes a browser-based user registration flow. This endpoint will set the appropriate
       *     cookies and anti-CSRF measures required for browser-based flows.
       *
       *     If this endpoint is opened as a link in the browser, it will be redirected to
       *     `selfservice.flows.registration.ui_url` with the flow ID set as the query parameter `?flow=`. If a valid user session
       *     exists already, the browser will be redirected to `urls.default_redirect_url`.
       *
       *     If this endpoint is called via an AJAX request, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *
       *     If this endpoint is called via an AJAX request, the response contains the registration flow without a redirect.
       *
       *     This endpoint is NOT INTENDED for clients that do not have a browser (Chrome, Firefox, ...) as cookies are needed.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["createBrowserRegistrationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/registration/flows": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Registration Flow
       * @description This endpoint returns a registration flow's context with, for example, error details and other information.
       *
       *     Browser flows expect the anti-CSRF cookie to be included in the request's HTTP Cookie Header.
       *     For AJAX requests you must ensure that cookies are included in the request or requests will fail.
       *
       *     If you use the browser-flow for server-side apps, the services need to run on a common top-level-domain
       *     and you need to forward the incoming HTTP Cookie header to this endpoint:
       *
       *     ```js
       *     pseudo-code example
       *     router.get('/registration', async function (req, res) {
       *     const flow = await client.getRegistrationFlow(req.header('cookie'), req.query['flow'])
       *
       *     res.render('registration', flow)
       *     })
       *     ```
       *
       *     This request may fail due to several reasons. The `error.id` can be one of:
       *
       *     `session_already_available`: The user is already signed in.
       *     `self_service_flow_expired`: The flow is expired and you should request a new one.
       *
       *     More information can be found at [Ory Kratos User Login](https://www.ory.sh/docs/kratos/self-service/flows/user-login) and [User Registration Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-registration).
       */
      get: operations["getRegistrationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/settings": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Complete Settings Flow
       * @description Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint
       *     behaves differently for API and browser flows.
       *
       *     API-initiated flows expect `application/json` to be sent in the body and respond with
       *     HTTP 200 and an application/json body with the session token on success;
       *     HTTP 303 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
       *     HTTP 400 on form validation errors.
       *     HTTP 401 when the endpoint is called without a valid session token.
       *     HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached or the session's AAL is too low.
       *     Implies that the user needs to re-authenticate.
       *
       *     Browser flows without HTTP Header `Accept` or with `Accept: text/*` respond with
       *     a HTTP 303 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
       *     a HTTP 303 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise.
       *     a HTTP 303 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached or the session's AAL is too low.
       *
       *     Browser flows with HTTP Header `Accept: application/json` respond with
       *     HTTP 200 and a application/json body with the signed in identity and a `Set-Cookie` header on success;
       *     HTTP 303 redirect to a fresh login flow if the original flow expired with the appropriate error messages set;
       *     HTTP 401 when the endpoint is called without a valid session cookie.
       *     HTTP 403 when the page is accessed without a session cookie or the session's AAL is too low.
       *     HTTP 400 on form validation errors.
       *
       *     Depending on your configuration this endpoint might return a 403 error if the session has a lower Authenticator
       *     Assurance Level (AAL) than is possible for the identity. This can happen if the identity has password + webauthn
       *     credentials (which would result in AAL2) but the session has only AAL1. If this error occurs, ask the user
       *     to sign in with the second factor (happens automatically for server-side browser flows) or change the configuration.
       *
       *     If this endpoint is called with a `Accept: application/json` HTTP header, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `session_refresh_required`: The identity requested to change something that needs a privileged session. Redirect
       *     the identity to the login init endpoint with query parameters `?refresh=true&return_to=<the-current-browser-url>`,
       *     or initiate a refresh login flow otherwise.
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `session_inactive`: No Ory Session was found - sign in a user first.
       *     `security_identity_mismatch`: The flow was interrupted with `session_refresh_required` but apparently some other
       *     identity logged in instead.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *     `browser_location_change_required`: Usually sent when an AJAX request indicates that the browser needs to open a specific URL.
       *     Most likely used in Social Sign In flows.
       *
       *     More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
       */
      post: operations["updateSettingsFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/settings/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Settings Flow for Native Apps
       * @description This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on.
       *     You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.
       *
       *     To fetch an existing settings flow call `/self-service/settings/flows?flow=<flow_id>`.
       *
       *     You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
       *     Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
       *     you vulnerable to a variety of CSRF attacks.
       *
       *     Depending on your configuration this endpoint might return a 403 error if the session has a lower Authenticator
       *     Assurance Level (AAL) than is possible for the identity. This can happen if the identity has password + webauthn
       *     credentials (which would result in AAL2) but the session has only AAL1. If this error occurs, ask the user
       *     to sign in with the second factor or change the configuration.
       *
       *     In the case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `session_inactive`: No Ory Session was found - sign in a user first.
       *
       *     This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
       *
       *     More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
       */
      get: operations["createNativeSettingsFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/settings/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Settings Flow for Browsers
       * @description This endpoint initializes a browser-based user settings flow. Once initialized, the browser will be redirected to
       *     `selfservice.flows.settings.ui_url` with the flow ID set as the query parameter `?flow=`. If no valid
       *     Ory Kratos Session Cookie is included in the request, a login flow will be initialized.
       *
       *     If this endpoint is opened as a link in the browser, it will be redirected to
       *     `selfservice.flows.settings.ui_url` with the flow ID set as the query parameter `?flow=`. If no valid user session
       *     was set, the browser will be redirected to the login endpoint.
       *
       *     If this endpoint is called via an AJAX request, the response contains the settings flow without any redirects
       *     or a 401 forbidden error if no valid session was set.
       *
       *     Depending on your configuration this endpoint might return a 403 error if the session has a lower Authenticator
       *     Assurance Level (AAL) than is possible for the identity. This can happen if the identity has password + webauthn
       *     credentials (which would result in AAL2) but the session has only AAL1. If this error occurs, ask the user
       *     to sign in with the second factor (happens automatically for server-side browser flows) or change the configuration.
       *
       *     If this endpoint is called via an AJAX request, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `session_inactive`: No Ory Session was found - sign in a user first.
       *     `security_identity_mismatch`: The requested `?return_to` address is not allowed to be used. Adjust this in the configuration!
       *
       *     This endpoint is NOT INTENDED for clients that do not have a browser (Chrome, Firefox, ...) as cookies are needed.
       *
       *     More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
       */
      get: operations["createBrowserSettingsFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/settings/flows": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Settings Flow
       * @description When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie
       *     or the Ory Kratos Session Token are set.
       *
       *     Depending on your configuration this endpoint might return a 403 error if the session has a lower Authenticator
       *     Assurance Level (AAL) than is possible for the identity. This can happen if the identity has password + webauthn
       *     credentials (which would result in AAL2) but the session has only AAL1. If this error occurs, ask the user
       *     to sign in with the second factor or change the configuration.
       *
       *     You can access this endpoint without credentials when using Ory Kratos' Admin API.
       *
       *     If this endpoint is called via an AJAX request, the response contains the flow without a redirect. In the
       *     case of an error, the `error.id` of the JSON response body can be one of:
       *
       *     `security_csrf_violation`: Unable to fetch the flow because a CSRF violation occurred.
       *     `session_inactive`: No Ory Session was found - sign in a user first.
       *     `security_identity_mismatch`: The flow was interrupted with `session_refresh_required` but apparently some other
       *     identity logged in instead.
       *
       *     More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
       */
      get: operations["getSettingsFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/verification": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Complete Verification Flow
       * @description Use this endpoint to complete a verification flow. This endpoint
       *     behaves differently for API and browser flows and has several states:
       *
       *     `choose_method` expects `flow` (in the URL query) and `email` (in the body) to be sent
       *     and works with API- and Browser-initiated flows.
       *     For API clients and Browser clients with HTTP Header `Accept: application/json` it either returns a HTTP 200 OK when the form is valid and HTTP 400 OK when the form is invalid
       *     and a HTTP 303 See Other redirect with a fresh verification flow if the flow was otherwise invalid (e.g. expired).
       *     For Browser clients without HTTP Header `Accept` or with `Accept: text/*` it returns a HTTP 303 See Other redirect to the Verification UI URL with the Verification Flow ID appended.
       *     `sent_email` is the success state after `choose_method` when using the `link` method and allows the user to request another verification email. It
       *     works for both API and Browser-initiated flows and returns the same responses as the flow in `choose_method` state.
       *     `passed_challenge` expects a `token` to be sent in the URL query and given the nature of the flow ("sending a verification link")
       *     does not have any API capabilities. The server responds with a HTTP 303 See Other redirect either to the Settings UI URL
       *     (if the link was valid) and instructs the user to update their password, or a redirect to the Verification UI URL with
       *     a new Verification Flow ID which contains an error message that the verification link was invalid.
       *
       *     More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation).
       */
      post: operations["updateVerificationFlow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/verification/api": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Verification Flow for Native Apps
       * @description This endpoint initiates a verification flow for API clients such as mobile devices, smart TVs, and so on.
       *
       *     To fetch an existing verification flow call `/self-service/verification/flows?flow=<flow_id>`.
       *
       *     You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
       *     Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
       *     you vulnerable to a variety of CSRF attacks.
       *
       *     This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
       *
       *     More information can be found at [Ory Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation).
       */
      get: operations["createNativeVerificationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/verification/browser": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Create Verification Flow for Browser Clients
       * @description This endpoint initializes a browser-based account verification flow. Once initialized, the browser will be redirected to
       *     `selfservice.flows.verification.ui_url` with the flow ID set as the query parameter `?flow=`.
       *
       *     If this endpoint is called via an AJAX request, the response contains the recovery flow without any redirects.
       *
       *     This endpoint is NOT INTENDED for API clients and only works with browsers (Chrome, Firefox, ...).
       *
       *     More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation).
       */
      get: operations["createBrowserVerificationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/self-service/verification/flows": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get Verification Flow
       * @description This endpoint returns a verification flow's context with, for example, error details and other information.
       *
       *     Browser flows expect the anti-CSRF cookie to be included in the request's HTTP Cookie Header.
       *     For AJAX requests you must ensure that cookies are included in the request or requests will fail.
       *
       *     If you use the browser-flow for server-side apps, the services need to run on a common top-level-domain
       *     and you need to forward the incoming HTTP Cookie header to this endpoint:
       *
       *     ```js
       *     pseudo-code example
       *     router.get('/recovery', async function (req, res) {
       *     const flow = await client.getVerificationFlow(req.header('cookie'), req.query['flow'])
       *
       *     res.render('verification', flow)
       *     })
       *     ```
       *
       *     More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation).
       */
      get: operations["getVerificationFlow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/sessions": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Get My Active Sessions
       * @description This endpoints returns all other active sessions that belong to the logged-in user.
       *     The current session can be retrieved by calling the `/sessions/whoami` endpoint.
       */
      get: operations["listMySessions"];
      put?: never;
      post?: never;
      /**
       * Disable my other sessions
       * @description Calling this endpoint invalidates all except the current session that belong to the logged-in user.
       *     Session data are not deleted.
       */
      delete: operations["disableMyOtherSessions"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/sessions/token-exchange": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /** Exchange Session Token */
      get: operations["exchangeSessionToken"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/sessions/whoami": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Check Who the Current HTTP Session Belongs To
       * @description Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated.
       *     Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent.
       *     When the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header
       *     in the response.
       *
       *     If you call this endpoint from a server-side application, you must forward the HTTP Cookie Header to this endpoint:
       *
       *     ```js
       *     pseudo-code example
       *     router.get('/protected-endpoint', async function (req, res) {
       *     const session = await client.toSession(undefined, req.header('cookie'))
       *
       *     console.log(session)
       *     })
       *     ```
       *
       *     When calling this endpoint from a non-browser application (e.g. mobile app) you must include the session token:
       *
       *     ```js
       *     pseudo-code example
       *     ...
       *     const session = await client.toSession("the-session-token")
       *
       *     console.log(session)
       *     ```
       *
       *     When using a token template, the token is included in the `tokenized` field of the session.
       *
       *     ```js
       *     pseudo-code example
       *     ...
       *     const session = await client.toSession("the-session-token", { tokenize_as: "example-jwt-template" })
       *
       *     console.log(session.tokenized) // The JWT
       *     ```
       *
       *     Depending on your configuration this endpoint might return a 403 status code if the session has a lower Authenticator
       *     Assurance Level (AAL) than is possible for the identity. This can happen if the identity has password + webauthn
       *     credentials (which would result in AAL2) but the session has only AAL1. If this error occurs, ask the user
       *     to sign in with the second factor or change the configuration.
       *
       *     This endpoint is useful for:
       *
       *     AJAX calls. Remember to send credentials and set up CORS correctly!
       *     Reverse proxies and API Gateways
       *     Server-side calls - use the `X-Session-Token` header!
       *
       *     This endpoint authenticates users by checking:
       *
       *     if the `Cookie` HTTP header was set containing an Ory Kratos Session Cookie;
       *     if the `Authorization: bearer <ory-session-token>` HTTP header was set with a valid Ory Kratos Session Token;
       *     if the `X-Session-Token` HTTP header was set with a valid Ory Kratos Session Token.
       *
       *     If none of these headers are set or the cookie or token are invalid, the endpoint returns a HTTP 401 status code.
       *
       *     As explained above, this request may fail due to several reasons. The `error.id` can be one of:
       *
       *     `session_inactive`: No active session was found in the request (e.g. no Ory Session Cookie / Ory Session Token).
       *     `session_aal2_required`: An active session was found but it does not fulfil the Authenticator Assurance Level, implying that the session must (e.g.) authenticate the second factor.
       */
      get: operations["toSession"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/sessions/{id}": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      get?: never;
      put?: never;
      post?: never;
      /**
       * Disable one of my sessions
       * @description Calling this endpoint invalidates the specified session. The current session cannot be revoked.
       *     Session data are not deleted.
       */
      delete: operations["disableMySession"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
    "/version": {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      /**
       * Return Running Software Version.
       * @description This endpoint returns the version of Ory Kratos.
       *
       *     If the service supports TLS Edge Termination, this endpoint does not require the
       *     `X-Forwarded-Proto` header to be set.
       *
       *     Be aware that if you are running multiple nodes of this service, the version will never
       *     refer to the cluster state, only to a single instance.
       */
      get: operations["getVersion"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
    };
  }
  export type webhooks = Record<string, never>;
  export interface components {
    schemas: {
      CodeChannel: string;
      DefaultError: unknown;
      /**
       * Format: int64
       * @description A Duration represents the elapsed time between two instants
       *     as an int64 nanosecond count. The representation limits the
       *     largest representable duration to approximately 290 years.
       */
      Duration: number;
      /** Format: int64 */
      ID: number;
      /** JSONRawMessage represents a json.RawMessage that works well with JSON, SQL, and Swagger. */
      JSONRawMessage: Record<string, never>;
      NullBool: boolean | null;
      NullInt: number | null;
      NullString: string | null;
      /** Format: date-time */
      NullTime: string | null;
      /** Format: uuid4 */
      NullUUID: string | null;
      /** OAuth2Client OAuth 2.0 Clients are used to perform OAuth 2.0 and OpenID Connect flows. Usually, OAuth 2.0 clients are generated for applications which want to consume your OAuth 2.0 or OpenID Connect capabilities. */
      OAuth2Client: {
        /** @description OAuth 2.0 Access Token Strategy  AccessTokenStrategy is the strategy used to generate access tokens. Valid options are `jwt` and `opaque`. `jwt` is a bad idea, see https://www.ory.sh/docs/hydra/advanced#json-web-tokens Setting the stragegy here overrides the global setting in `strategies.access_token`. */
        access_token_strategy?: string;
        allowed_cors_origins?: string[];
        audience?: string[];
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        authorization_code_grant_access_token_lifespan?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        authorization_code_grant_id_token_lifespan?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        authorization_code_grant_refresh_token_lifespan?: string;
        /** @description OpenID Connect Back-Channel Logout Session Required  Boolean value specifying whether the RP requires that a sid (session ID) Claim be included in the Logout Token to identify the RP session with the OP when the backchannel_logout_uri is used. If omitted, the default value is false. */
        backchannel_logout_session_required?: boolean;
        /** @description OpenID Connect Back-Channel Logout URI  RP URL that will cause the RP to log itself out when sent a Logout Token by the OP. */
        backchannel_logout_uri?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        client_credentials_grant_access_token_lifespan?: string;
        /** @description OAuth 2.0 Client ID  The ID is immutable. If no ID is provided, a UUID4 will be generated. */
        client_id?: string;
        /** @description OAuth 2.0 Client Name  The human-readable name of the client to be presented to the end-user during authorization. */
        client_name?: string;
        /** @description OAuth 2.0 Client Secret  The secret will be included in the create request as cleartext, and then never again. The secret is kept in hashed format and is not recoverable once lost. */
        client_secret?: string;
        /**
         * Format: int64
         * @description OAuth 2.0 Client Secret Expires At  The field is currently not supported and its value is always 0.
         */
        client_secret_expires_at?: number;
        /** @description OAuth 2.0 Client URI  ClientURI is a URL string of a web page providing information about the client. If present, the server SHOULD display this URL to the end-user in a clickable fashion. */
        client_uri?: string;
        contacts?: string[];
        /**
         * Format: date-time
         * @description OAuth 2.0 Client Creation Date  CreatedAt returns the timestamp of the client's creation.
         */
        created_at?: string;
        /** @description OpenID Connect Front-Channel Logout Session Required  Boolean value specifying whether the RP requires that iss (issuer) and sid (session ID) query parameters be included to identify the RP session with the OP when the frontchannel_logout_uri is used. If omitted, the default value is false. */
        frontchannel_logout_session_required?: boolean;
        /** @description OpenID Connect Front-Channel Logout URI  RP URL that will cause the RP to log itself out when rendered in an iframe by the OP. An iss (issuer) query parameter and a sid (session ID) query parameter MAY be included by the OP to enable the RP to validate the request and to determine which of the potentially multiple sessions is to be logged out; if either is included, both MUST be. */
        frontchannel_logout_uri?: string;
        grant_types?: string[];
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        implicit_grant_access_token_lifespan?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        implicit_grant_id_token_lifespan?: string;
        /** @description OAuth 2.0 Client JSON Web Key Set  Client's JSON Web Key Set [JWK] document, passed by value. The semantics of the jwks parameter are the same as the jwks_uri parameter, other than that the JWK Set is passed by value, rather than by reference. This parameter is intended only to be used by Clients that, for some reason, are unable to use the jwks_uri parameter, for instance, by native applications that might not have a location to host the contents of the JWK Set. If a Client can use jwks_uri, it MUST NOT use jwks. One significant downside of jwks is that it does not enable key rotation (which jwks_uri does, as described in Section 10 of OpenID Connect Core 1.0 [OpenID.Core]). The jwks_uri and jwks parameters MUST NOT be used together. */
        jwks?: unknown;
        /** @description OAuth 2.0 Client JSON Web Key Set URL  URL for the Client's JSON Web Key Set [JWK] document. If the Client signs requests to the Server, it contains the signing key(s) the Server uses to validate signatures from the Client. The JWK Set MAY also contain the Client's encryption keys(s), which are used by the Server to encrypt responses to the Client. When both signing and encryption keys are made available, a use (Key Use) parameter value is REQUIRED for all keys in the referenced JWK Set to indicate each key's intended usage. Although some algorithms allow the same key to be used for both signatures and encryption, doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509 representations of keys provided. When used, the bare key values MUST still be present and MUST match those in the certificate. */
        jwks_uri?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        jwt_bearer_grant_access_token_lifespan?: string;
        /** @description OAuth 2.0 Client Logo URI  A URL string referencing the client's logo. */
        logo_uri?: string;
        metadata?: unknown;
        /** @description OAuth 2.0 Client Owner  Owner is a string identifying the owner of the OAuth 2.0 Client. */
        owner?: string;
        /** @description OAuth 2.0 Client Policy URI  PolicyURI is a URL string that points to a human-readable privacy policy document that describes how the deployment organization collects, uses, retains, and discloses personal data. */
        policy_uri?: string;
        post_logout_redirect_uris?: string[];
        redirect_uris?: string[];
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        refresh_token_grant_access_token_lifespan?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        refresh_token_grant_id_token_lifespan?: string;
        /** @description Specify a time duration in milliseconds, seconds, minutes, hours. */
        refresh_token_grant_refresh_token_lifespan?: string;
        /** @description OpenID Connect Dynamic Client Registration Access Token  RegistrationAccessToken can be used to update, get, or delete the OAuth2 Client. It is sent when creating a client using Dynamic Client Registration. */
        registration_access_token?: string;
        /** @description OpenID Connect Dynamic Client Registration URL  RegistrationClientURI is the URL used to update, get, or delete the OAuth2 Client. */
        registration_client_uri?: string;
        /** @description OpenID Connect Request Object Signing Algorithm  JWS [JWS] alg algorithm [JWA] that MUST be used for signing Request Objects sent to the OP. All Request Objects from this Client MUST be rejected, if not signed with this algorithm. */
        request_object_signing_alg?: string;
        request_uris?: string[];
        response_types?: string[];
        /** @description OAuth 2.0 Client Scope  Scope is a string containing a space-separated list of scope values (as described in Section 3.3 of OAuth 2.0 [RFC6749]) that the client can use when requesting access tokens. */
        scope?: string;
        /** @description OpenID Connect Sector Identifier URI  URL using the https scheme to be used in calculating Pseudonymous Identifiers by the OP. The URL references a file with a single JSON array of redirect_uri values. */
        sector_identifier_uri?: string;
        /** @description SkipConsent skips the consent screen for this client. This field can only be set from the admin API. */
        skip_consent?: boolean;
        /** @description SkipLogoutConsent skips the logout consent screen for this client. This field can only be set from the admin API. */
        skip_logout_consent?: boolean;
        /** @description OpenID Connect Subject Type  The `subject_types_supported` Discovery parameter contains a list of the supported subject_type values for this server. Valid types include `pairwise` and `public`. */
        subject_type?: string;
        /** @description OAuth 2.0 Token Endpoint Authentication Method  Requested Client Authentication method for the Token Endpoint. The options are:  `client_secret_basic`: (default) Send `client_id` and `client_secret` as `application/x-www-form-urlencoded` encoded in the HTTP Authorization header. `client_secret_post`: Send `client_id` and `client_secret` as `application/x-www-form-urlencoded` in the HTTP body. `private_key_jwt`: Use JSON Web Tokens to authenticate the client. `none`: Used for public clients (native apps, mobile apps) which can not have secrets. */
        token_endpoint_auth_method?: string;
        /** @description OAuth 2.0 Token Endpoint Signing Algorithm  Requested Client Authentication signing algorithm for the Token Endpoint. */
        token_endpoint_auth_signing_alg?: string;
        /** @description OAuth 2.0 Client Terms of Service URI  A URL string pointing to a human-readable terms of service document for the client that describes a contractual relationship between the end-user and the client that the end-user accepts when authorizing the client. */
        tos_uri?: string;
        /**
         * Format: date-time
         * @description OAuth 2.0 Client Last Update Date  UpdatedAt returns the timestamp of the last update.
         */
        updated_at?: string;
        /** @description OpenID Connect Request Userinfo Signed Response Algorithm  JWS alg algorithm [JWA] REQUIRED for signing UserInfo Responses. If this is specified, the response will be JWT [JWT] serialized, and signed using JWS. The default, if omitted, is for the UserInfo Response to return the Claims as a UTF-8 encoded JSON object using the application/json content-type. */
        userinfo_signed_response_alg?: string;
      };
      /** @description OAuth2ConsentRequestOpenIDConnectContext struct for OAuth2ConsentRequestOpenIDConnectContext */
      OAuth2ConsentRequestOpenIDConnectContext: {
        /** @description ACRValues is the Authentication AuthorizationContext Class Reference requested in the OAuth 2.0 Authorization request. It is a parameter defined by OpenID Connect and expresses which level of authentication (e.g. 2FA) is required.  OpenID Connect defines it as follows: > Requested Authentication AuthorizationContext Class Reference values. Space-separated string that specifies the acr values that the Authorization Server is being requested to use for processing this Authentication Request, with the values appearing in order of preference. The Authentication AuthorizationContext Class satisfied by the authentication performed is returned as the acr Claim Value, as specified in Section 2. The acr Claim is requested as a Voluntary Claim by this parameter. */
        acr_values?: string[];
        /** @description Display is a string value that specifies how the Authorization Server displays the authentication and consent user interface pages to the End-User. The defined values are: page: The Authorization Server SHOULD display the authentication and consent UI consistent with a full User Agent page view. If the display parameter is not specified, this is the default display mode. popup: The Authorization Server SHOULD display the authentication and consent UI consistent with a popup User Agent window. The popup User Agent window should be of an appropriate size for a login-focused dialog and should not obscure the entire window that it is popping up over. touch: The Authorization Server SHOULD display the authentication and consent UI consistent with a device that leverages a touch interface. wap: The Authorization Server SHOULD display the authentication and consent UI consistent with a \"feature phone\" type display.  The Authorization Server MAY also attempt to detect the capabilities of the User Agent and present an appropriate display. */
        display?: string;
        /** @description IDTokenHintClaims are the claims of the ID Token previously issued by the Authorization Server being passed as a hint about the End-User's current or past authenticated session with the Client. */
        id_token_hint_claims?: {
          [key: string]: unknown;
        };
        /** @description LoginHint hints about the login identifier the End-User might use to log in (if necessary). This hint can be used by an RP if it first asks the End-User for their e-mail address (or other identifier) and then wants to pass that value as a hint to the discovered authorization service. This value MAY also be a phone number in the format specified for the phone_number Claim. The use of this parameter is optional. */
        login_hint?: string;
        /** @description UILocales is the End-User'id preferred languages and scripts for the user interface, represented as a space-separated list of BCP47 [RFC5646] language tag values, ordered by preference. For instance, the value \"fr-CA fr en\" represents a preference for French as spoken in Canada, then French (without a region designation), followed by English (without a region designation). An error SHOULD NOT result if some or all of the requested locales are not supported by the OpenID Provider. */
        ui_locales?: string[];
      };
      OAuth2LoginChallengeParams: Record<string, never>;
      /** @description OAuth2LoginRequest struct for OAuth2LoginRequest */
      OAuth2LoginRequest: {
        /** @description ID is the identifier (\"login challenge\") of the login request. It is used to identify the session. */
        challenge?: string;
        client?: components["schemas"]["OAuth2Client"];
        oidc_context?: components["schemas"]["OAuth2ConsentRequestOpenIDConnectContext"];
        /** @description RequestURL is the original OAuth 2.0 Authorization URL requested by the OAuth 2.0 client. It is the URL which initiates the OAuth 2.0 Authorization Code or OAuth 2.0 Implicit flow. This URL is typically not needed, but might come in handy if you want to deal with additional request parameters. */
        request_url?: string;
        requested_access_token_audience?: string[];
        requested_scope?: string[];
        /** @description SessionID is the login session ID. If the user-agent reuses a login session (via cookie / remember flag) this ID will remain the same. If the user-agent did not have an existing authentication session (e.g. remember is false) this will be a new random value. This value is used as the \"sid\" parameter in the ID Token and in OIDC Front-/Back- channel logout. It's value can generally be used to associate consecutive login requests by a certain user. */
        session_id?: string;
        /** @description Skip, if true, implies that the client has requested the same scopes from the same user previously. If true, you can skip asking the user to grant the requested scopes, and simply forward the user to the redirect URL.  This feature allows you to update / set session information. */
        skip?: boolean;
        /** @description Subject is the user ID of the end-user that authenticated. Now, that end user needs to grant or deny the scope requested by the OAuth 2.0 client. If this value is set and `skip` is true, you MUST include this subject type when accepting the login request, or the request will fail. */
        subject?: string;
      };
      Provider: {
        /** @description The RP's client identifier, issued by the IdP. */
        client_id?: string;
        /** @description A full path of the IdP config file. */
        config_url?: string;
        /**
         * @description By specifying one of domain_hints values provided by the accounts endpoints,
         *     the FedCM dialog selectively shows the specified account.
         */
        domain_hint?: string;
        /**
         * @description Array of strings that specifies the user information ("name", " email",
         *     "picture") that RP needs IdP to share with them.
         *
         *     Note: Field API is supported by Chrome 132 and later.
         */
        fields?: string[];
        /**
         * @description By specifying one of login_hints values provided by the accounts endpoints,
         *     the FedCM dialog selectively shows the specified account.
         */
        login_hint?: string;
        /**
         * @description A random string to ensure the response is issued for this specific request.
         *     Prevents replay attacks.
         */
        nonce?: string;
        /**
         * @description Custom object that allows to specify additional key-value parameters:
         *     scope: A string value containing additional permissions that RP needs to
         *     request, for example " drive.readonly calendar.readonly"
         *     nonce: A random string to ensure the response is issued for this specific
         *     request. Prevents replay attacks.
         *
         *     Other custom key-value parameters.
         *
         *     Note: parameters is supported from Chrome 132.
         */
        parameters?: {
          [key: string]: string;
        };
      };
      /** RecoveryAddressType must not exceed 16 characters as that is the limitation in the SQL Schema. */
      RecoveryAddressType: string;
      /** Format: date-time */
      Time: string;
      /** Format: uuid4 */
      UUID: string;
      UpdateFedcmFlowBody: {
        /** @description CSRFToken is the anti-CSRF token. */
        csrf_token: string;
        /**
         * @description Nonce is the nonce that was used in the `navigator.credentials.get` call. If
         *     specified, it must match the `nonce` claim in the token.
         */
        nonce?: string;
        /** @description Token contains the result of `navigator.credentials.get`. */
        token: string;
      };
      /**
       * Authenticator Assurance Level (AAL)
       * @description The authenticator assurance level can be one of "aal1", "aal2", or "aal3". A higher number means that it is harder
       *     for an attacker to compromise the account.
       *
       *     Generally, "aal1" implies that one authentication factor was used while AAL2 implies that two factors (e.g.
       *     password + TOTP) have been used.
       *
       *     To learn more about these levels please head over to: https://www.ory.sh/kratos/docs/concepts/credentials
       * @enum {string}
       */
      authenticatorAssuranceLevel: "aal0" | "aal1" | "aal2" | "aal3";
      /** @description Patch identities response */
      batchPatchIdentitiesResponse: {
        /** @description The patch responses for the individual identities. */
        identities?: components["schemas"]["identityPatchResponse"][];
      };
      /** @description Control API consistency guarantees */
      consistencyRequestParameters: {
        /**
         * @description Read Consistency Level (preview)
         *
         *     The read consistency level determines the consistency guarantee for reads:
         *
         *     strong (slow): The read is guaranteed to return the most recent data committed at the start of the read.
         *     eventual (very fast): The result will return data that is about 4.8 seconds old.
         *
         *     The default consistency guarantee can be changed in the Ory Network Console or using the Ory CLI with
         *     `ory patch project --replace '/previews/default_read_consistency_level="strong"'`.
         *
         *     Setting the default consistency level to `eventual` may cause regressions in the future as we add consistency
         *     controls to more APIs. Currently, the following APIs will be affected by this setting:
         *
         *     `GET /admin/identities`
         *
         *     This feature is in preview and only available in Ory Network.
         *      ConsistencyLevelUnset  ConsistencyLevelUnset is the unset / default consistency level.
         *     strong ConsistencyLevelStrong  ConsistencyLevelStrong is the strong consistency level.
         *     eventual ConsistencyLevelEventual  ConsistencyLevelEventual is the eventual consistency level using follower read timestamps.
         * @enum {string}
         */
        consistency?: "" | "strong" | "eventual";
      };
      continueWith: components["schemas"]["continueWithVerificationUi"] | components["schemas"]["continueWithSetOrySessionToken"] | components["schemas"]["continueWithSettingsUi"] | components["schemas"]["continueWithRecoveryUi"] | components["schemas"]["continueWithRedirectBrowserTo"];
      /** @description Indicates, that the UI flow could be continued by showing a recovery ui */
      continueWithRecoveryUi: {
        /**
         * @description Action will always be `show_recovery_ui`
         *     show_recovery_ui ContinueWithActionShowRecoveryUIString (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        action: "show_recovery_ui";
        flow: components["schemas"]["continueWithRecoveryUiFlow"];
      };
      continueWithRecoveryUiFlow: {
        /**
         * Format: uuid
         * @description The ID of the recovery flow
         */
        id: string;
        /**
         * @description The URL of the recovery flow
         *
         *     If this value is set, redirect the user's browser to this URL. This value is typically unset for native clients / API flows.
         */
        url?: string;
      };
      /** @description Indicates, that the UI flow could be continued by showing a recovery ui */
      continueWithRedirectBrowserTo: {
        /**
         * @description Action will always be `redirect_browser_to`
         *     redirect_browser_to ContinueWithActionRedirectBrowserToString (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        action: "redirect_browser_to";
        /** @description The URL to redirect the browser to */
        redirect_browser_to: string;
      };
      /** @description Indicates that a session was issued, and the application should use this token for authenticated requests */
      continueWithSetOrySessionToken: {
        /**
         * @description Action will always be `set_ory_session_token`
         *     set_ory_session_token ContinueWithActionSetOrySessionTokenString (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        action: "set_ory_session_token";
        /** @description Token is the token of the session */
        ory_session_token: string;
      };
      /** @description Indicates, that the UI flow could be continued by showing a settings ui */
      continueWithSettingsUi: {
        /**
         * @description Action will always be `show_settings_ui`
         *     show_settings_ui ContinueWithActionShowSettingsUIString (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        action: "show_settings_ui";
        flow: components["schemas"]["continueWithSettingsUiFlow"];
      };
      continueWithSettingsUiFlow: {
        /**
         * Format: uuid
         * @description The ID of the settings flow
         */
        id: string;
        /**
         * @description The URL of the settings flow
         *
         *     If this value is set, redirect the user's browser to this URL. This value is typically unset for native clients / API flows.
         */
        url?: string;
      };
      /** @description Indicates, that the UI flow could be continued by showing a verification ui */
      continueWithVerificationUi: {
        /**
         * @description Action will always be `show_verification_ui`
         *     show_verification_ui ContinueWithActionShowVerificationUIString (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        action: "show_verification_ui";
        flow: components["schemas"]["continueWithVerificationUiFlow"];
      };
      continueWithVerificationUiFlow: {
        /**
         * Format: uuid
         * @description The ID of the verification flow
         */
        id: string;
        /**
         * @description The URL of the verification flow
         *
         *     If this value is set, redirect the user's browser to this URL. This value is typically unset for native clients / API flows.
         */
        url?: string;
        /** @description The address that should be verified in this flow */
        verifiable_address: string;
      };
      /**
       * @description A Message's Status
       * @enum {string}
       */
      courierMessageStatus: "queued" | "sent" | "processing" | "abandoned";
      /**
       * A Message's Type
       * @description It can either be `email` or `phone`
       * @enum {string}
       */
      courierMessageType: "email" | "phone";
      /**
       * CreateFedcmFlowResponse
       * @description Contains a list of all available FedCM providers.
       */
      createFedcmFlowResponse: {
        csrf_token?: string;
        providers?: components["schemas"]["Provider"][];
      };
      /** @description Create Identity Body */
      createIdentityBody: {
        credentials?: components["schemas"]["identityWithCredentials"];
        /** @description Store metadata about the user which is only accessible through admin APIs such as `GET /admin/identities/<id>`. */
        metadata_admin?: unknown;
        /**
         * @description Store metadata about the identity which the identity itself can see when calling for example the
         *     session endpoint. Do not store sensitive information (e.g. credit score) about the identity in this field.
         */
        metadata_public?: unknown;
        organization_id?: components["schemas"]["NullUUID"];
        /**
         * @description RecoveryAddresses contains all the addresses that can be used to recover an identity.
         *
         *     Use this structure to import recovery addresses for an identity. Please keep in mind
         *     that the address needs to be represented in the Identity Schema or this field will be overwritten
         *     on the next identity update.
         */
        recovery_addresses?: components["schemas"]["recoveryIdentityAddress"][];
        /** @description SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
        schema_id: string;
        /**
         * @description State is the identity's state.
         *     active StateActive
         *     inactive StateInactive
         * @enum {string}
         */
        state?: "active" | "inactive";
        /**
         * @description Traits represent an identity's traits. The identity is able to create, modify, and delete traits
         *     in a self-service manner. The input will always be validated against the JSON Schema defined
         *     in `schema_url`.
         */
        traits: Record<string, never>;
        /**
         * @description VerifiableAddresses contains all the addresses that can be verified by the user.
         *
         *     Use this structure to import verified addresses for an identity. Please keep in mind
         *     that the address needs to be represented in the Identity Schema or this field will be overwritten
         *     on the next identity update.
         */
        verifiable_addresses?: components["schemas"]["verifiableIdentityAddress"][];
      };
      /** @description Create Recovery Code for Identity Request Body */
      createRecoveryCodeForIdentityBody: {
        /**
         * @description Code Expires In
         *
         *     The recovery code will expire after that amount of time has passed. Defaults to the configuration value of
         *     `selfservice.methods.code.config.lifespan`.
         */
        expires_in?: string;
        flow_type?: components["schemas"]["selfServiceFlowType"];
        /**
         * Format: uuid
         * @description Identity to Recover
         *
         *     The identity's ID you wish to recover.
         */
        identity_id: string;
      };
      /** @description Create Recovery Link for Identity Request Body */
      createRecoveryLinkForIdentityBody: {
        /**
         * @description Link Expires In
         *
         *     The recovery link will expire after that amount of time has passed. Defaults to the configuration value of
         *     `selfservice.methods.code.config.lifespan`.
         */
        expires_in?: string;
        /**
         * Format: uuid
         * @description Identity to Recover
         *
         *     The identity's ID you wish to recover.
         */
        identity_id: string;
      };
      /** @description Deleted Session Count */
      deleteMySessionsCount: {
        /**
         * Format: int64
         * @description The number of sessions that were revoked.
         */
        count?: number;
      };
      /** Is returned when an active session was found but the requested AAL is not satisfied. */
      errorAuthenticatorAssuranceLevelNotSatisfied: {
        error?: components["schemas"]["genericError"];
        /** @description Points to where to redirect the user to next. */
        redirect_browser_to?: string;
      };
      /** Is sent when a flow requires a browser to change its location. */
      errorBrowserLocationChangeRequired: {
        error?: components["schemas"]["errorGeneric"];
        /** @description Points to where to redirect the user to next. */
        redirect_browser_to?: string;
      };
      /** @description Is sent when a flow is replaced by a different flow of the same class */
      errorFlowReplaced: {
        error?: components["schemas"]["genericError"];
        /**
         * Format: uuid
         * @description The flow ID that should be used for the new flow as it contains the correct messages.
         */
        use_flow_id?: string;
      };
      /**
       * JSON API Error Response
       * @description The standard Ory JSON API error format.
       */
      errorGeneric: {
        error: components["schemas"]["genericError"];
      };
      flowError: {
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at?: string;
        error?: Record<string, never>;
        /**
         * Format: uuid
         * @description ID of the error container.
         */
        id: string;
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at?: string;
      };
      genericError: {
        /**
         * Format: int64
         * @description The status code
         * @example 404
         */
        code?: number;
        /**
         * @description Debug information
         *
         *     This field is often not exposed to protect against leaking
         *     sensitive information.
         * @example SQL field "foo" is not a bool.
         */
        debug?: string;
        /** @description Further error details */
        details?: Record<string, never>;
        /**
         * @description The error ID
         *
         *     Useful when trying to identify various errors in application logic.
         */
        id?: string;
        /**
         * @description Error message
         *
         *     The error's message.
         * @example The resource could not be found
         */
        message: string;
        /**
         * @description A human-readable reason for the error
         * @example User with ID 1234 does not exist.
         */
        reason?: string;
        /**
         * @description The request ID
         *
         *     The request ID is often exposed internally in order to trace
         *     errors across service architectures. This is often a UUID.
         * @example d7ef54b1-ec15-46e6-bccb-524b82c035e6
         */
        request?: string;
        /**
         * @description The status description
         * @example Not Found
         */
        status?: string;
      };
      /** The not ready status of the service. */
      healthNotReadyStatus: {
        /** @description Errors contains a list of errors that caused the not ready status. */
        errors?: {
          [key: string]: string;
        };
      };
      /** The health status of the service. */
      healthStatus: {
        /** @description Status always contains "ok". */
        status?: string;
      };
      /**
       * Identity represents an Ory Kratos identity
       * @description An [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model) represents a (human) user in Ory.
       */
      identity: {
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at?: string;
        /** @description Credentials represents all credentials that can be used for authenticating this identity. */
        credentials?: {
          [key: string]: components["schemas"]["identityCredentials"];
        };
        /**
         * Format: uuid
         * @description ID is the identity's unique identifier.
         *
         *     The Identity ID can not be changed and can not be chosen. This ensures future
         *     compatibility and optimization for distributed stores such as CockroachDB.
         */
        id: string;
        metadata_admin?: components["schemas"]["nullJsonRawMessage"];
        metadata_public?: components["schemas"]["nullJsonRawMessage"];
        organization_id?: components["schemas"]["NullUUID"];
        /** @description RecoveryAddresses contains all the addresses that can be used to recover an identity. */
        recovery_addresses?: components["schemas"]["recoveryIdentityAddress"][];
        /** @description SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
        schema_id: string;
        /**
         * @description SchemaURL is the URL of the endpoint where the identity's traits schema can be fetched from.
         *
         *     format: url
         */
        schema_url: string;
        /**
         * @description State is the identity's state.
         *
         *     This value has currently no effect.
         *     active StateActive
         *     inactive StateInactive
         * @enum {string}
         */
        state?: "active" | "inactive";
        state_changed_at?: components["schemas"]["nullTime"];
        traits: components["schemas"]["identityTraits"];
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at?: string;
        /** @description VerifiableAddresses contains all the addresses that can be verified by the user. */
        verifiable_addresses?: components["schemas"]["verifiableIdentityAddress"][];
      };
      /** @description Credentials represents a specific credential type */
      identityCredentials: {
        config?: components["schemas"]["JSONRawMessage"];
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at?: string;
        /** @description Identifiers represents a list of unique identifiers this credential type matches. */
        identifiers?: string[];
        /**
         * @description Type discriminates between different types of credentials.
         *     password CredentialsTypePassword
         *     oidc CredentialsTypeOIDC
         *     totp CredentialsTypeTOTP
         *     lookup_secret CredentialsTypeLookup
         *     webauthn CredentialsTypeWebAuthn
         *     code CredentialsTypeCodeAuth
         *     passkey CredentialsTypePasskey
         *     profile CredentialsTypeProfile
         *     saml CredentialsTypeSAML
         *     link_recovery CredentialsTypeRecoveryLink  CredentialsTypeRecoveryLink is a special credential type linked to the link strategy (recovery flow).  It is not used within the credentials object itself.
         *     code_recovery CredentialsTypeRecoveryCode
         * @enum {string}
         */
        type?: "password" | "oidc" | "totp" | "lookup_secret" | "webauthn" | "code" | "passkey" | "profile" | "saml" | "link_recovery" | "code_recovery";
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at?: string;
        /**
         * Format: int64
         * @description Version refers to the version of the credential. Useful when changing the config schema.
         */
        version?: number;
      };
      /** @description CredentialsCode represents a one time login/registration code */
      identityCredentialsCode: {
        addresses?: components["schemas"]["identityCredentialsCodeAddress"][];
      };
      identityCredentialsCodeAddress: {
        /** @description The address for this code */
        address?: string;
        channel?: components["schemas"]["CodeChannel"];
      };
      /** CredentialsOIDC is contains the configuration for credentials of the type oidc. */
      identityCredentialsOidc: {
        providers?: components["schemas"]["identityCredentialsOidcProvider"][];
      };
      /** CredentialsOIDCProvider is contains a specific OpenID COnnect credential for a particular connection (e.g. Google). */
      identityCredentialsOidcProvider: {
        initial_access_token?: string;
        initial_id_token?: string;
        initial_refresh_token?: string;
        organization?: string;
        provider?: string;
        subject?: string;
        use_auto_link?: boolean;
      };
      /** CredentialsPassword is contains the configuration for credentials of the type password. */
      identityCredentialsPassword: {
        /** @description HashedPassword is a hash-representation of the password. */
        hashed_password?: string;
        /**
         * @description UsePasswordMigrationHook is set to true if the password should be migrated
         *     using the password migration hook. If set, and the HashedPassword is empty, a
         *     webhook will be called during login to migrate the password.
         */
        use_password_migration_hook?: boolean;
      };
      /** @description Payload for patching an identity */
      identityPatch: {
        create?: components["schemas"]["createIdentityBody"];
        /**
         * Format: uuid
         * @description The ID of this patch.
         *
         *     The patch ID is optional. If specified, the ID will be returned in the
         *     response, so consumers of this API can correlate the response with the
         *     patch.
         */
        patch_id?: string;
      };
      /** @description Response for a single identity patch */
      identityPatchResponse: {
        /**
         * @description The action for this specific patch
         *     create ActionCreate  Create this identity.
         *     error ActionError  Error indicates that the patch failed.
         * @enum {string}
         */
        action?: "create" | "error";
        error?: components["schemas"]["DefaultError"];
        /**
         * Format: uuid
         * @description The identity ID payload of this patch
         */
        identity?: string;
        /**
         * Format: uuid
         * @description The ID of this patch response, if an ID was specified in the patch.
         */
        patch_id?: string;
      };
      /** @description Raw JSON Schema */
      identitySchema: Record<string, never>;
      /** @description An Identity JSON Schema Container */
      identitySchemaContainer: {
        /** @description The ID of the Identity JSON Schema */
        id?: string;
        /** @description The actual Identity JSON Schema */
        schema?: Record<string, never>;
      };
      /** @description List of Identity JSON Schemas */
      identitySchemas: components["schemas"]["identitySchemaContainer"][];
      /**
       * @description Traits represent an identity's traits. The identity is able to create, modify, and delete traits
       *     in a self-service manner. The input will always be validated against the JSON Schema defined
       *     in `schema_url`.
       */
      identityTraits: unknown;
      /** @description VerifiableAddressStatus must not exceed 16 characters as that is the limitation in the SQL Schema */
      identityVerifiableAddressStatus: string;
      /** @description Create Identity and Import Credentials */
      identityWithCredentials: {
        oidc?: components["schemas"]["identityWithCredentialsOidc"];
        password?: components["schemas"]["identityWithCredentialsPassword"];
      };
      /** @description Create Identity and Import Social Sign In Credentials */
      identityWithCredentialsOidc: {
        config?: components["schemas"]["identityWithCredentialsOidcConfig"];
      };
      identityWithCredentialsOidcConfig: {
        config?: components["schemas"]["identityWithCredentialsPasswordConfig"];
        /** @description A list of OpenID Connect Providers */
        providers?: components["schemas"]["identityWithCredentialsOidcConfigProvider"][];
      };
      /** @description Create Identity and Import Social Sign In Credentials Configuration */
      identityWithCredentialsOidcConfigProvider: {
        /** @description The OpenID Connect provider to link the subject to. Usually something like `google` or `github`. */
        provider: string;
        /** @description The subject (`sub`) of the OpenID Connect connection. Usually the `sub` field of the ID Token. */
        subject: string;
        /** @description If set, this credential allows the user to sign in using the OpenID Connect provider without setting the subject first. */
        use_auto_link?: boolean;
      };
      /** @description Create Identity and Import Password Credentials */
      identityWithCredentialsPassword: {
        config?: components["schemas"]["identityWithCredentialsPasswordConfig"];
      };
      /** @description Create Identity and Import Password Credentials Configuration */
      identityWithCredentialsPasswordConfig: {
        /** @description The hashed password in [PHC format](https://www.ory.sh/docs/kratos/manage-identities/import-user-accounts-identities#hashed-passwords) */
        hashed_password?: string;
        /** @description The password in plain text if no hash is available. */
        password?: string;
        /** @description If set to true, the password will be migrated using the password migration hook. */
        use_password_migration_hook?: boolean;
      };
      /** @description A JSONPatch document as defined by RFC 6902 */
      jsonPatch: {
        /**
         * @description This field is used together with operation "move" and uses JSON Pointer notation.
         *
         *     Learn more [about JSON Pointers](https://datatracker.ietf.org/doc/html/rfc6901#section-5).
         * @example /name
         */
        from?: string;
        /**
         * @description The operation to be performed. One of "add", "remove", "replace", "move", "copy", or "test".
         * @example replace
         */
        op: string;
        /**
         * @description The path to the target path. Uses JSON pointer notation.
         *
         *     Learn more [about JSON Pointers](https://datatracker.ietf.org/doc/html/rfc6901#section-5).
         * @example /name
         */
        path: string;
        /**
         * @description The value to be used within the operations.
         *
         *     Learn more [about JSON Pointers](https://datatracker.ietf.org/doc/html/rfc6901#section-5).
         * @example foobar
         */
        value?: unknown;
      };
      /** @description A JSONPatchDocument request */
      jsonPatchDocument: components["schemas"]["jsonPatch"][];
      /**
       * Login Flow
       * @description This object represents a login flow. A login flow is initiated at the "Initiate Login API / Browser Flow"
       *     endpoint by a client.
       *
       *     Once a login flow is completed successfully, a session cookie or session token will be issued.
       */
      loginFlow: {
        /**
         * @description The active login method
         *
         *     If set contains the login method used. If the flow is new, it is unset.
         *     password CredentialsTypePassword
         *     oidc CredentialsTypeOIDC
         *     totp CredentialsTypeTOTP
         *     lookup_secret CredentialsTypeLookup
         *     webauthn CredentialsTypeWebAuthn
         *     code CredentialsTypeCodeAuth
         *     passkey CredentialsTypePasskey
         *     profile CredentialsTypeProfile
         *     saml CredentialsTypeSAML
         *     link_recovery CredentialsTypeRecoveryLink  CredentialsTypeRecoveryLink is a special credential type linked to the link strategy (recovery flow).  It is not used within the credentials object itself.
         *     code_recovery CredentialsTypeRecoveryCode
         * @enum {string}
         */
        active?: "password" | "oidc" | "totp" | "lookup_secret" | "webauthn" | "code" | "passkey" | "profile" | "saml" | "link_recovery" | "code_recovery";
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at?: string;
        /**
         * Format: date-time
         * @description ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
         *     a new flow has to be initiated.
         */
        expires_at: string;
        /**
         * Format: uuid
         * @description ID represents the flow's unique ID. When performing the login flow, this
         *     represents the id in the login UI's query parameter: http://<selfservice.flows.login.ui_url>/?flow=<flow_id>
         */
        id: string;
        /**
         * Format: date-time
         * @description IssuedAt is the time (UTC) when the flow started.
         */
        issued_at: string;
        /**
         * @description Ory OAuth 2.0 Login Challenge.
         *
         *     This value is set using the `login_challenge` query parameter of the registration and login endpoints.
         *     If set will cooperate with Ory OAuth2 and OpenID to act as an OAuth2 server / OpenID Provider.
         */
        oauth2_login_challenge?: string;
        oauth2_login_request?: components["schemas"]["OAuth2LoginRequest"];
        organization_id?: components["schemas"]["NullUUID"];
        /** @description Refresh stores whether this login flow should enforce re-authentication. */
        refresh?: boolean;
        /**
         * @description RequestURL is the initial URL that was requested from Ory Kratos. It can be used
         *     to forward information contained in the URL's path or query for example.
         */
        request_url: string;
        requested_aal?: components["schemas"]["authenticatorAssuranceLevel"];
        /** @description ReturnTo contains the requested return_to URL. */
        return_to?: string;
        /**
         * @description SessionTokenExchangeCode holds the secret code that the client can use to retrieve a session token after the login flow has been completed.
         *     This is only set if the client has requested a session token exchange code, and if the flow is of type "api",
         *     and only on creating the login flow.
         */
        session_token_exchange_code?: string;
        /**
         * @description State represents the state of this request:
         *
         *     choose_method: ask the user to choose a method to sign in with
         *     sent_email: the email has been sent to the user
         *     passed_challenge: the request was successful and the login challenge was passed.
         */
        state: unknown;
        /** @description TransientPayload is used to pass data from the login to hooks and email templates */
        transient_payload?: Record<string, never>;
        type: components["schemas"]["selfServiceFlowType"];
        ui: components["schemas"]["uiContainer"];
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at?: string;
      };
      /**
       * Login flow state (experimental)
       * @description The experimental state represents the state of a login flow. This field is EXPERIMENTAL and subject to change!
       * @enum {string}
       */
      loginFlowState: "choose_method" | "sent_email" | "passed_challenge";
      /** @description Logout Flow */
      logoutFlow: {
        /** @description LogoutToken can be used to perform logout using AJAX. */
        logout_token: string;
        /**
         * @description LogoutURL can be opened in a browser to sign the user out.
         *
         *     format: uri
         */
        logout_url: string;
      };
      message: {
        body: string;
        channel?: string;
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at: string;
        /**
         * @description Dispatches store information about the attempts of delivering a message
         *     May contain an error if any happened, or just the `success` state.
         */
        dispatches?: components["schemas"]["messageDispatch"][];
        /** Format: uuid */
        id: string;
        recipient: string;
        /** Format: int64 */
        send_count: number;
        status: components["schemas"]["courierMessageStatus"];
        subject: string;
        /**
         * @description recovery_invalid TypeRecoveryInvalid
         *     recovery_valid TypeRecoveryValid
         *     recovery_code_invalid TypeRecoveryCodeInvalid
         *     recovery_code_valid TypeRecoveryCodeValid
         *     verification_invalid TypeVerificationInvalid
         *     verification_valid TypeVerificationValid
         *     verification_code_invalid TypeVerificationCodeInvalid
         *     verification_code_valid TypeVerificationCodeValid
         *     stub TypeTestStub
         *     login_code_valid TypeLoginCodeValid
         *     registration_code_valid TypeRegistrationCodeValid
         * @enum {string}
         */
        template_type: "recovery_invalid" | "recovery_valid" | "recovery_code_invalid" | "recovery_code_valid" | "verification_invalid" | "verification_valid" | "verification_code_invalid" | "verification_code_valid" | "stub" | "login_code_valid" | "registration_code_valid";
        type: components["schemas"]["courierMessageType"];
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at: string;
      };
      /**
       * @description MessageDispatch represents an attempt of sending a courier message
       *     It contains the status of the attempt (failed or successful) and the error if any occured
       */
      messageDispatch: {
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at: string;
        error?: components["schemas"]["JSONRawMessage"];
        /**
         * Format: uuid
         * @description The ID of this message dispatch
         */
        id: string;
        /**
         * Format: uuid
         * @description The ID of the message being dispatched
         */
        message_id: string;
        /**
         * @description The status of this dispatch
         *     Either "failed" or "success"
         *     failed CourierMessageDispatchStatusFailed
         *     success CourierMessageDispatchStatusSuccess
         * @enum {string}
         */
        status: "failed" | "success";
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at: string;
      };
      /** Is sent when a privileged session is required to perform the settings update. */
      needsPrivilegedSessionError: {
        error?: components["schemas"]["genericError"];
        /** @description Points to where to redirect the user to next. */
        redirect_browser_to: string;
      };
      nullDuration: string | null;
      nullInt64: number | null;
      /** @description NullJSONRawMessage represents a json.RawMessage that works well with JSON, SQL, and Swagger and is NULLable- */
      nullJsonRawMessage: unknown;
      /**
       * NullTime implements sql.NullTime functionality.
       * Format: date-time
       */
      nullTime: string;
      /** @description Patch Identities Body */
      patchIdentitiesBody: {
        /**
         * @description Identities holds the list of patches to apply
         *
         *     required
         */
        identities?: components["schemas"]["identityPatch"][];
      };
      /** @description Perform Native Logout Request Body */
      performNativeLogoutBody: {
        /**
         * @description The Session Token
         *
         *     Invalidate this session token.
         */
        session_token: string;
      };
      /**
       * Recovery Code for Identity
       * @description Used when an administrator creates a recovery code for an identity.
       */
      recoveryCodeForIdentity: {
        /**
         * Format: date-time
         * @description Expires At is the timestamp of when the recovery flow expires
         *
         *     The timestamp when the recovery code expires.
         */
        expires_at?: string;
        /** @description RecoveryCode is the code that can be used to recover the account */
        recovery_code: string;
        /**
         * @description RecoveryLink with flow
         *
         *     This link opens the recovery UI with an empty `code` field.
         */
        recovery_link: string;
      };
      /**
       * A Recovery Flow
       * @description This request is used when an identity wants to recover their account.
       *
       *     We recommend reading the [Account Recovery Documentation](../self-service/flows/password-reset-account-recovery)
       */
      recoveryFlow: {
        /**
         * @description Active, if set, contains the recovery method that is being used. It is initially
         *     not set.
         */
        active?: string;
        /** @description Contains possible actions that could follow this flow */
        continue_with?: components["schemas"]["continueWith"][];
        /**
         * Format: date-time
         * @description ExpiresAt is the time (UTC) when the request expires. If the user still wishes to update the setting,
         *     a new request has to be initiated.
         */
        expires_at: string;
        /**
         * Format: uuid
         * @description ID represents the request's unique ID. When performing the recovery flow, this
         *     represents the id in the recovery ui's query parameter: http://<selfservice.flows.recovery.ui_url>?request=<id>
         */
        id: string;
        /**
         * Format: date-time
         * @description IssuedAt is the time (UTC) when the request occurred.
         */
        issued_at: string;
        /**
         * @description RequestURL is the initial URL that was requested from Ory Kratos. It can be used
         *     to forward information contained in the URL's path or query for example.
         */
        request_url: string;
        /** @description ReturnTo contains the requested return_to URL. */
        return_to?: string;
        /**
         * @description State represents the state of this request:
         *
         *     choose_method: ask the user to choose a method (e.g. recover account via email)
         *     sent_email: the email has been sent to the user
         *     passed_challenge: the request was successful and the recovery challenge was passed.
         */
        state: unknown;
        /** @description TransientPayload is used to pass data from the recovery flow to hooks and email templates */
        transient_payload?: Record<string, never>;
        type: components["schemas"]["selfServiceFlowType"];
        ui: components["schemas"]["uiContainer"];
      };
      /**
       * Recovery flow state (experimental)
       * @description The experimental state represents the state of a recovery flow. This field is EXPERIMENTAL and subject to change!
       * @enum {unknown}
       */
      recoveryFlowState: "choose_method" | "sent_email" | "passed_challenge";
      recoveryIdentityAddress: {
        /**
         * Format: date-time
         * @description CreatedAt is a helper struct field for gobuffalo.pop.
         */
        created_at?: string;
        /** Format: uuid */
        id: string;
        /**
         * Format: date-time
         * @description UpdatedAt is a helper struct field for gobuffalo.pop.
         */
        updated_at?: string;
        value: string;
        via: components["schemas"]["RecoveryAddressType"];
      };
      /**
       * Identity Recovery Link
       * @description Used when an administrator creates a recovery link for an identity.
       */
      recoveryLinkForIdentity: {
        /**
         * Format: date-time
         * @description Recovery Link Expires At
         *
         *     The timestamp when the recovery link expires.
         */
        expires_at?: string;
        /**
         * @description Recovery Link
         *
         *     This link can be used to recover the account.
         */
        recovery_link: string;
      };
      registrationFlow: {
        /**
         * @description Active, if set, contains the registration method that is being used. It is initially
         *     not set.
         *     password CredentialsTypePassword
         *     oidc CredentialsTypeOIDC
         *     totp CredentialsTypeTOTP
         *     lookup_secret CredentialsTypeLookup
         *     webauthn CredentialsTypeWebAuthn
         *     code CredentialsTypeCodeAuth
         *     passkey CredentialsTypePasskey
         *     profile CredentialsTypeProfile
         *     saml CredentialsTypeSAML
         *     link_recovery CredentialsTypeRecoveryLink  CredentialsTypeRecoveryLink is a special credential type linked to the link strategy (recovery flow).  It is not used within the credentials object itself.
         *     code_recovery CredentialsTypeRecoveryCode
         * @enum {string}
         */
        active?: "password" | "oidc" | "totp" | "lookup_secret" | "webauthn" | "code" | "passkey" | "profile" | "saml" | "link_recovery" | "code_recovery";
        /**
         * Format: date-time
         * @description ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
         *     a new flow has to be initiated.
         */
        expires_at: string;
        /**
         * Format: uuid
         * @description ID represents the flow's unique ID. When performing the registration flow, this
         *     represents the id in the registration ui's query parameter: http://<selfservice.flows.registration.ui_url>/?flow=<id>
         */
        id: string;
        /**
         * Format: date-time
         * @description IssuedAt is the time (UTC) when the flow occurred.
         */
        issued_at: string;
        /**
         * @description Ory OAuth 2.0 Login Challenge.
         *
         *     This value is set using the `login_challenge` query parameter of the registration and login endpoints.
         *     If set will cooperate with Ory OAuth2 and OpenID to act as an OAuth2 server / OpenID Provider.
         */
        oauth2_login_challenge?: string;
        oauth2_login_request?: components["schemas"]["OAuth2LoginRequest"];
        organization_id?: components["schemas"]["NullUUID"];
        /**
         * @description RequestURL is the initial URL that was requested from Ory Kratos. It can be used
         *     to forward information contained in the URL's path or query for example.
         */
        request_url: string;
        /** @description ReturnTo contains the requested return_to URL. */
        return_to?: string;
        /**
         * @description SessionTokenExchangeCode holds the secret code that the client can use to retrieve a session token after the flow has been completed.
         *     This is only set if the client has requested a session token exchange code, and if the flow is of type "api",
         *     and only on creating the flow.
         */
        session_token_exchange_code?: string;
        /**
         * @description State represents the state of this request:
         *
         *     choose_method: ask the user to choose a method (e.g. registration with email)
         *     sent_email: the email has been sent to the user
         *     passed_challenge: the request was successful and the registration challenge was passed.
         */
        state: unknown;
        /** @description TransientPayload is used to pass data from the registration to a webhook */
        transient_payload?: Record<string, never>;
        type: components["schemas"]["selfServiceFlowType"];
        ui: components["schemas"]["uiContainer"];
      };
      /**
       * Registration flow state (experimental)
       * @description The experimental state represents the state of a registration flow. This field is EXPERIMENTAL and subject to change!
       * @enum {string}
       */
      registrationFlowState: "choose_method" | "sent_email" | "passed_challenge";
      /** @description Is sent when a flow is expired */
      selfServiceFlowExpiredError: {
        error?: components["schemas"]["genericError"];
        /**
         * Format: date-time
         * @description When the flow has expired
         */
        expired_at?: string;
        since?: components["schemas"]["Duration"];
        /**
         * Format: uuid
         * @description The flow ID that should be used for the new flow as it contains the correct messages.
         */
        use_flow_id?: string;
      };
      /**
       * Type is the flow type.
       * @description The flow type can either be `api` or `browser`.
       */
      selfServiceFlowType: string;
      /** @description A Session */
      session: {
        /** @description Active state. If false the session is no longer active. */
        active?: boolean;
        /**
         * Format: date-time
         * @description The Session Authentication Timestamp
         *
         *     When this session was authenticated at. If multi-factor authentication was used this
         *     is the time when the last factor was authenticated (e.g. the TOTP code challenge was completed).
         */
        authenticated_at?: string;
        authentication_methods?: components["schemas"]["sessionAuthenticationMethods"];
        authenticator_assurance_level?: components["schemas"]["authenticatorAssuranceLevel"];
        /** @description Devices has history of all endpoints where the session was used */
        devices?: components["schemas"]["sessionDevice"][];
        /**
         * Format: date-time
         * @description The Session Expiry
         *
         *     When this session expires at.
         */
        expires_at?: string;
        /**
         * Format: uuid
         * @description Session ID
         */
        id: string;
        identity?: components["schemas"]["identity"];
        /**
         * Format: date-time
         * @description The Session Issuance Timestamp
         *
         *     When this session was issued at. Usually equal or close to `authenticated_at`.
         */
        issued_at?: string;
        /**
         * @description Tokenized is the tokenized (e.g. JWT) version of the session.
         *
         *     It is only set when the `tokenize` query parameter was set to a valid tokenize template during calls to `/session/whoami`.
         */
        tokenized?: string;
      };
      /**
       * AuthenticationMethod identifies an authentication method
       * @description A singular authenticator used during authentication / login.
       */
      sessionAuthenticationMethod: {
        aal?: components["schemas"]["authenticatorAssuranceLevel"];
        /**
         * Format: date-time
         * @description When the authentication challenge was completed.
         */
        completed_at?: string;
        /**
         * The method used
         * @enum {string}
         */
        method?: "link_recovery" | "code_recovery" | "password" | "code" | "totp" | "oidc" | "webauthn" | "lookup_secret" | "v0.6_legacy_session";
        /** @description The Organization id used for authentication */
        organization?: string;
        /** @description OIDC or SAML provider id used for authentication */
        provider?: string;
      };
      /**
       * List of (Used) AuthenticationMethods
       * @description A list of authenticators which were used to authenticate the session.
       */
      sessionAuthenticationMethods: components["schemas"]["sessionAuthenticationMethod"][];
      /** @description Device corresponding to a Session */
      sessionDevice: {
        /**
         * Format: uuid
         * @description Device record ID
         */
        id: string;
        /** @description IPAddress of the client */
        ip_address?: string;
        /** @description Geo Location corresponding to the IP Address */
        location?: string;
        /** @description UserAgent of the client */
        user_agent?: string;
      };
      /**
       * Flow represents a Settings Flow
       * @description This flow is used when an identity wants to update settings
       *     (e.g. profile data, passwords, ...) in a selfservice manner.
       *
       *     We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
       */
      settingsFlow: {
        /**
         * @description Active, if set, contains the registration method that is being used. It is initially
         *     not set.
         */
        active?: string;
        /**
         * @description Contains a list of actions, that could follow this flow
         *
         *     It can, for example, contain a reference to the verification flow, created as part of the user's
         *     registration.
         */
        continue_with?: components["schemas"]["continueWith"][];
        /**
         * Format: date-time
         * @description ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to update the setting,
         *     a new flow has to be initiated.
         */
        expires_at: string;
        /**
         * Format: uuid
         * @description ID represents the flow's unique ID. When performing the settings flow, this
         *     represents the id in the settings ui's query parameter: http://<selfservice.flows.settings.ui_url>?flow=<id>
         */
        id: string;
        identity: components["schemas"]["identity"];
        /**
         * Format: date-time
         * @description IssuedAt is the time (UTC) when the flow occurred.
         */
        issued_at: string;
        /**
         * @description RequestURL is the initial URL that was requested from Ory Kratos. It can be used
         *     to forward information contained in the URL's path or query for example.
         */
        request_url: string;
        /** @description ReturnTo contains the requested return_to URL. */
        return_to?: string;
        /**
         * @description State represents the state of this flow. It knows two states:
         *
         *     show_form: No user data has been collected, or it is invalid, and thus the form should be shown.
         *     success: Indicates that the settings flow has been updated successfully with the provided data.
         *     Done will stay true when repeatedly checking. If set to true, done will revert back to false only
         *     when a flow with invalid (e.g. "please use a valid phone number") data was sent.
         */
        state: unknown;
        /** @description TransientPayload is used to pass data from the settings flow to hooks and email templates */
        transient_payload?: Record<string, never>;
        type: components["schemas"]["selfServiceFlowType"];
        ui: components["schemas"]["uiContainer"];
      };
      /**
       * Settings flow state (experimental)
       * @description The experimental state represents the state of a settings flow. This field is EXPERIMENTAL and subject to change!
       * @enum {string}
       */
      settingsFlowState: "show_form" | "success";
      /** @description The Response for Registration Flows via API */
      successfulCodeExchangeResponse: {
        session: components["schemas"]["session"];
        /**
         * @description The Session Token
         *
         *     A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
         *     Header:
         *
         *     Authorization: bearer ${session-token}
         *
         *     The session token is only issued for API flows, not for Browser flows!
         */
        session_token?: string;
      };
      /** @description The Response for Login Flows via API */
      successfulNativeLogin: {
        /**
         * @description Contains a list of actions, that could follow this flow
         *
         *     It can, for example, this will contain a reference to the verification flow, created as part of the user's
         *     registration or the token of the session.
         */
        continue_with?: components["schemas"]["continueWith"][];
        session: components["schemas"]["session"];
        /**
         * @description The Session Token
         *
         *     A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
         *     Header:
         *
         *     Authorization: bearer ${session-token}
         *
         *     The session token is only issued for API flows, not for Browser flows!
         */
        session_token?: string;
      };
      /** @description The Response for Registration Flows via API */
      successfulNativeRegistration: {
        /**
         * @description Contains a list of actions, that could follow this flow
         *
         *     It can, for example, this will contain a reference to the verification flow, created as part of the user's
         *     registration or the token of the session.
         */
        continue_with?: components["schemas"]["continueWith"][];
        identity: components["schemas"]["identity"];
        session?: components["schemas"]["session"];
        /**
         * @description The Session Token
         *
         *     This field is only set when the session hook is configured as a post-registration hook.
         *
         *     A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
         *     Header:
         *
         *     Authorization: bearer ${session-token}
         *
         *     The session token is only issued for API flows, not for Browser flows!
         */
        session_token?: string;
      };
      tokenPagination: {
        /**
         * Format: int64
         * @description Items per page
         *
         *     This is the number of items per page to return.
         *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
         * @default 250
         */
        page_size: number;
        /**
         * @description Next Page Token
         *
         *     The next page token.
         *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
         * @default 1
         */
        page_token: string;
      };
      tokenPaginationHeaders: {
        /**
         * @description The link header contains pagination links.
         *
         *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
         *
         *     in: header
         */
        link?: string;
        /**
         * @description The total number of clients.
         *
         *     in: header
         */
        "x-total-count"?: string;
      };
      /** @description Container represents a HTML Form. The container can work with both HTTP Form and JSON requests */
      uiContainer: {
        /** @description Action should be used as the form action URL `<form action="{{ .Action }}" method="post">`. */
        action: string;
        messages?: components["schemas"]["uiTexts"];
        /** @description Method is the form method (e.g. POST) */
        method: string;
        nodes: components["schemas"]["uiNodes"];
      };
      /**
       * Node represents a flow's nodes
       * @description Nodes are represented as HTML elements or their native UI equivalents. For example,
       *     a node can be an `<img>` tag, or an `<input element>` but also `some plain text`.
       */
      uiNode: {
        attributes: components["schemas"]["uiNodeAttributes"];
        /**
         * @description Group specifies which group (e.g. password authenticator) this node belongs to.
         *     default DefaultGroup
         *     password PasswordGroup
         *     oidc OpenIDConnectGroup
         *     profile ProfileGroup
         *     link LinkGroup
         *     code CodeGroup
         *     totp TOTPGroup
         *     lookup_secret LookupGroup
         *     webauthn WebAuthnGroup
         *     passkey PasskeyGroup
         *     identifier_first IdentifierFirstGroup
         *     captcha CaptchaGroup
         *     saml SAMLGroup
         * @enum {string}
         */
        group: "default" | "password" | "oidc" | "profile" | "link" | "code" | "totp" | "lookup_secret" | "webauthn" | "passkey" | "identifier_first" | "captcha" | "saml";
        messages: components["schemas"]["uiTexts"];
        meta: components["schemas"]["uiNodeMeta"];
        /**
         * @description The node's type
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script
         * @enum {string}
         */
        type: "text" | "input" | "img" | "a" | "script";
      };
      /** AnchorAttributes represents the attributes of an anchor node. */
      uiNodeAnchorAttributes: {
        /**
         * @description The link's href (destination) URL.
         *
         *     format: uri
         */
        href: string;
        /** @description A unique identifier */
        id: string;
        /**
         * @description NodeType represents this node's types. It is a mirror of `node.type` and
         *     is primarily used to allow compatibility with OpenAPI 3.0.  In this struct it technically always is "a".
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        node_type: "a";
        title: components["schemas"]["uiText"];
      };
      /** Attributes represents a list of attributes (e.g. `href="foo"` for links). */
      uiNodeAttributes: components["schemas"]["uiNodeInputAttributes"] | components["schemas"]["uiNodeTextAttributes"] | components["schemas"]["uiNodeImageAttributes"] | components["schemas"]["uiNodeAnchorAttributes"] | components["schemas"]["uiNodeScriptAttributes"];
      /** ImageAttributes represents the attributes of an image node. */
      uiNodeImageAttributes: {
        /**
         * Format: int64
         * @description Height of the image
         */
        height: number;
        /** @description A unique identifier */
        id: string;
        /**
         * @description NodeType represents this node's types. It is a mirror of `node.type` and
         *     is primarily used to allow compatibility with OpenAPI 3.0.  In this struct it technically always is "img".
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        node_type: "img";
        /**
         * @description The image's source URL.
         *
         *     format: uri
         */
        src: string;
        /**
         * Format: int64
         * @description Width of the image
         */
        width: number;
      };
      /** @description InputAttributes represents the attributes of an input node */
      uiNodeInputAttributes: {
        /**
         * @description The autocomplete attribute for the input.
         *     email InputAttributeAutocompleteEmail
         *     tel InputAttributeAutocompleteTel
         *     url InputAttributeAutocompleteUrl
         *     current-password InputAttributeAutocompleteCurrentPassword
         *     new-password InputAttributeAutocompleteNewPassword
         *     one-time-code InputAttributeAutocompleteOneTimeCode
         * @enum {string}
         */
        autocomplete?: "email" | "tel" | "url" | "current-password" | "new-password" | "one-time-code";
        /** @description Sets the input's disabled field to true or false. */
        disabled: boolean;
        label?: components["schemas"]["uiText"];
        /**
         * Format: int64
         * @description MaxLength may contain the input's maximum length.
         */
        maxlength?: number;
        /** @description The input's element name. */
        name: string;
        /**
         * @description NodeType represents this node's types. It is a mirror of `node.type` and
         *     is primarily used to allow compatibility with OpenAPI 3.0.  In this struct it technically always is "input".
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        node_type: "input";
        /**
         * @description OnClick may contain javascript which should be executed on click. This is primarily
         *     used for WebAuthn.
         *
         *     Deprecated: Using OnClick requires the use of eval() which is a security risk. Use OnClickTrigger instead.
         */
        onclick?: string;
        /**
         * @description OnClickTrigger may contain a WebAuthn trigger which should be executed on click.
         *
         *     The trigger maps to a JavaScript function provided by Ory, which triggers actions such as PassKey registration or login.
         *     oryWebAuthnRegistration WebAuthnTriggersWebAuthnRegistration
         *     oryWebAuthnLogin WebAuthnTriggersWebAuthnLogin
         *     oryPasskeyLogin WebAuthnTriggersPasskeyLogin
         *     oryPasskeyLoginAutocompleteInit WebAuthnTriggersPasskeyLoginAutocompleteInit
         *     oryPasskeyRegistration WebAuthnTriggersPasskeyRegistration
         *     oryPasskeySettingsRegistration WebAuthnTriggersPasskeySettingsRegistration
         * @enum {string}
         */
        onclickTrigger?: "oryWebAuthnRegistration" | "oryWebAuthnLogin" | "oryPasskeyLogin" | "oryPasskeyLoginAutocompleteInit" | "oryPasskeyRegistration" | "oryPasskeySettingsRegistration";
        /**
         * @description OnLoad may contain javascript which should be executed on load. This is primarily
         *     used for WebAuthn.
         *
         *     Deprecated: Using OnLoad requires the use of eval() which is a security risk. Use OnLoadTrigger instead.
         */
        onload?: string;
        /**
         * @description OnLoadTrigger may contain a WebAuthn trigger which should be executed on load.
         *
         *     The trigger maps to a JavaScript function provided by Ory, which triggers actions such as PassKey registration or login.
         *     oryWebAuthnRegistration WebAuthnTriggersWebAuthnRegistration
         *     oryWebAuthnLogin WebAuthnTriggersWebAuthnLogin
         *     oryPasskeyLogin WebAuthnTriggersPasskeyLogin
         *     oryPasskeyLoginAutocompleteInit WebAuthnTriggersPasskeyLoginAutocompleteInit
         *     oryPasskeyRegistration WebAuthnTriggersPasskeyRegistration
         *     oryPasskeySettingsRegistration WebAuthnTriggersPasskeySettingsRegistration
         * @enum {string}
         */
        onloadTrigger?: "oryWebAuthnRegistration" | "oryWebAuthnLogin" | "oryPasskeyLogin" | "oryPasskeyLoginAutocompleteInit" | "oryPasskeyRegistration" | "oryPasskeySettingsRegistration";
        /** @description The input's pattern. */
        pattern?: string;
        /** @description Mark this input field as required. */
        required?: boolean;
        /**
         * @description The input's element type.
         *     text InputAttributeTypeText
         *     password InputAttributeTypePassword
         *     number InputAttributeTypeNumber
         *     checkbox InputAttributeTypeCheckbox
         *     hidden InputAttributeTypeHidden
         *     email InputAttributeTypeEmail
         *     tel InputAttributeTypeTel
         *     submit InputAttributeTypeSubmit
         *     button InputAttributeTypeButton
         *     datetime-local InputAttributeTypeDateTimeLocal
         *     date InputAttributeTypeDate
         *     url InputAttributeTypeURI
         * @enum {string}
         */
        type: "text" | "password" | "number" | "checkbox" | "hidden" | "email" | "tel" | "submit" | "button" | "datetime-local" | "date" | "url";
        /** @description The input's value. */
        value?: unknown;
      };
      /**
       * A Node's Meta Information
       * @description This might include a label and other information that can optionally
       *     be used to render UIs.
       */
      uiNodeMeta: {
        label?: components["schemas"]["uiText"];
      };
      /** ScriptAttributes represent script nodes which load javascript. */
      uiNodeScriptAttributes: {
        /** @description The script async type */
        async: boolean;
        /** @description The script cross origin policy */
        crossorigin: string;
        /** @description A unique identifier */
        id: string;
        /** @description The script's integrity hash */
        integrity: string;
        /**
         * @description NodeType represents this node's types. It is a mirror of `node.type` and
         *     is primarily used to allow compatibility with OpenAPI 3.0. In this struct it technically always is "script".
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        node_type: "script";
        /**
         * @description Nonce for CSP
         *
         *     A nonce you may want to use to improve your Content Security Policy.
         *     You do not have to use this value but if you want to improve your CSP
         *     policies you may use it. You can also choose to use your own nonce value!
         */
        nonce: string;
        /** @description The script referrer policy */
        referrerpolicy: string;
        /** @description The script source */
        src: string;
        /** @description The script MIME type */
        type: string;
      };
      /** TextAttributes represents the attributes of a text node. */
      uiNodeTextAttributes: {
        /** @description A unique identifier */
        id: string;
        /**
         * @description NodeType represents this node's types. It is a mirror of `node.type` and
         *     is primarily used to allow compatibility with OpenAPI 3.0.  In this struct it technically always is "text".
         *     text Text
         *     input Input
         *     img Image
         *     a Anchor
         *     script Script (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        node_type: "text";
        text: components["schemas"]["uiText"];
      };
      uiNodes: components["schemas"]["uiNode"][];
      uiText: {
        /** @description The message's context. Useful when customizing messages. */
        context?: Record<string, never>;
        id: components["schemas"]["ID"];
        /** @description The message text. Written in american english. */
        text: string;
        /**
         * @description The message type.
         *     info Info
         *     error Error
         *     success Success
         * @enum {string}
         */
        type: "info" | "error" | "success";
      };
      uiTexts: components["schemas"]["uiText"][];
      unexpectedError: string;
      /** @description Update Identity Body */
      updateIdentityBody: {
        credentials?: components["schemas"]["identityWithCredentials"];
        /** @description Store metadata about the user which is only accessible through admin APIs such as `GET /admin/identities/<id>`. */
        metadata_admin?: unknown;
        /**
         * @description Store metadata about the identity which the identity itself can see when calling for example the
         *     session endpoint. Do not store sensitive information (e.g. credit score) about the identity in this field.
         */
        metadata_public?: unknown;
        /**
         * @description SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. If set
         *     will update the Identity's SchemaID.
         */
        schema_id: string;
        /**
         * @description State is the identity's state.
         *     active StateActive
         *     inactive StateInactive
         * @enum {string}
         */
        state: "active" | "inactive";
        /**
         * @description Traits represent an identity's traits. The identity is able to create, modify, and delete traits
         *     in a self-service manner. The input will always be validated against the JSON Schema defined
         *     in `schema_id`.
         */
        traits: Record<string, never>;
      };
      updateLoginFlowBody: components["schemas"]["updateLoginFlowWithPasswordMethod"] | components["schemas"]["updateLoginFlowWithOidcMethod"] | components["schemas"]["updateLoginFlowWithTotpMethod"] | components["schemas"]["updateLoginFlowWithWebAuthnMethod"] | components["schemas"]["updateLoginFlowWithLookupSecretMethod"] | components["schemas"]["updateLoginFlowWithCodeMethod"] | components["schemas"]["updateLoginFlowWithPasskeyMethod"] | components["schemas"]["updateLoginFlowWithIdentifierFirstMethod"];
      /** @description Update Login flow using the code method */
      updateLoginFlowWithCodeMethod: {
        /**
         * @description Address is the address to send the code to, in case that there are multiple addresses. This field
         *     is only used in two-factor flows and is ineffective for passwordless flows.
         */
        address?: string;
        /** @description Code is the 6 digits code sent to the user */
        code?: string;
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token: string;
        /**
         * @description Identifier is the code identifier
         *     The identifier requires that the user has already completed the registration or settings with code flow.
         */
        identifier?: string;
        /**
         * @description Method should be set to "code" when logging in using the code strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "code";
        /** @description Resend is set when the user wants to resend the code */
        resend?: string;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Login Flow with Multi-Step Method */
      updateLoginFlowWithIdentifierFirstMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /** @description Identifier is the email or username of the user trying to log in. */
        identifier: string;
        /**
         * @description Method should be set to "password" when logging in using the identifier and password strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "identifier_first";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Login Flow with Lookup Secret Method */
      updateLoginFlowWithLookupSecretMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /** @description The lookup secret. */
        lookup_secret: string;
        /**
         * @description Method should be set to "lookup_secret" when logging in using the lookup_secret strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "lookup_secret";
      };
      /** @description Update Login Flow with OpenID Connect Method */
      updateLoginFlowWithOidcMethod: {
        /** @description The CSRF Token */
        csrf_token?: string;
        /**
         * @description IDToken is an optional id token provided by an OIDC provider
         *
         *     If submitted, it is verified using the OIDC provider's public key set and the claims are used to populate
         *     the OIDC credentials of the identity.
         *     If the OIDC provider does not store additional claims (such as name, etc.) in the IDToken itself, you can use
         *     the `traits` field to populate the identity's traits. Note, that Apple only includes the users email in the IDToken.
         *
         *     Supported providers are
         *     Apple
         *     Google
         */
        id_token?: string;
        /**
         * @description IDTokenNonce is the nonce, used when generating the IDToken.
         *     If the provider supports nonce validation, the nonce will be validated against this value and required.
         */
        id_token_nonce?: string;
        /**
         * @description Method to use
         *
         *     This field must be set to `oidc` when using the oidc method. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "oidc";
        /** @description The provider to register with */
        provider: string;
        /** @description The identity traits. This is a placeholder for the registration flow. */
        traits?: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description UpstreamParameters are the parameters that are passed to the upstream identity provider.
         *
         *     These parameters are optional and depend on what the upstream identity provider supports.
         *     Supported parameters are:
         *     `login_hint` (string): The `login_hint` parameter suppresses the account chooser and either pre-fills the email box on the sign-in form, or selects the proper session.
         *     `hd` (string): The `hd` parameter limits the login/registration process to a Google Organization, e.g. `mycollege.edu`.
         *     `prompt` (string): The `prompt` specifies whether the Authorization Server prompts the End-User for reauthentication and consent, e.g. `select_account`.
         */
        upstream_parameters?: Record<string, never>;
      };
      /** @description Update Login Flow with Passkey Method */
      updateLoginFlowWithPasskeyMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description Method should be set to "passkey" when logging in using the Passkey strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "passkey";
        /**
         * @description Login a WebAuthn Security Key
         *
         *     This must contain the ID of the WebAuthN connection.
         */
        passkey_login?: string;
      };
      /** @description Update Login Flow with Password Method */
      updateLoginFlowWithPasswordMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /** @description Identifier is the email or username of the user trying to log in. */
        identifier: string;
        /**
         * @description Method should be set to "password" when logging in using the identifier and password strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "password";
        /** @description The user's password. */
        password: string;
        /**
         * @description Identifier is the email or username of the user trying to log in.
         *     This field is deprecated!
         */
        password_identifier?: string;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Login Flow with TOTP Method */
      updateLoginFlowWithTotpMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description Method should be set to "totp" when logging in using the TOTP strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "totp";
        /** @description The TOTP code. */
        totp_code: string;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Login Flow with WebAuthn Method */
      updateLoginFlowWithWebAuthnMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /** @description Identifier is the email or username of the user trying to log in. */
        identifier: string;
        /**
         * @description Method should be set to "webAuthn" when logging in using the WebAuthn strategy. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "webauthn";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description Login a WebAuthn Security Key
         *
         *     This must contain the ID of the WebAuthN connection.
         */
        webauthn_login?: string;
      };
      /** @description Update Recovery Flow Request Body */
      updateRecoveryFlowBody: components["schemas"]["updateRecoveryFlowWithLinkMethod"] | components["schemas"]["updateRecoveryFlowWithCodeMethod"];
      /** @description Update Recovery Flow with Code Method */
      updateRecoveryFlowWithCodeMethod: {
        /**
         * @description Code from the recovery email
         *
         *     If you want to submit a code, use this field, but make sure to _not_ include the email field, as well.
         */
        code?: string;
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description The email address of the account to recover
         *
         *     If the email belongs to a valid account, a recovery email will be sent.
         *
         *     If you want to notify the email address if the account does not exist, see
         *     the [notify_unknown_recipients flag](https://www.ory.sh/docs/kratos/self-service/flows/account-recovery-password-reset#attempted-recovery-notifications)
         *
         *     If a code was already sent, including this field in the payload will invalidate the sent code and re-send a new code.
         *
         *     format: email
         */
        email?: string;
        /**
         * @description Method is the method that should be used for this recovery flow
         *
         *     Allowed values are `link` and `code`.
         *     link RecoveryStrategyLink
         *     code RecoveryStrategyCode (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "code";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Recovery Flow with Link Method */
      updateRecoveryFlowWithLinkMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description Email to Recover
         *
         *     Needs to be set when initiating the flow. If the email is a registered
         *     recovery email, a recovery link will be sent. If the email is not known,
         *     a email with details on what happened will be sent instead.
         *
         *     format: email
         */
        email: string;
        /**
         * @description Method is the method that should be used for this recovery flow
         *
         *     Allowed values are `link` and `code`
         *     link RecoveryStrategyLink
         *     code RecoveryStrategyCode (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "link";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Registration Request Body */
      updateRegistrationFlowBody: components["schemas"]["updateRegistrationFlowWithPasswordMethod"] | components["schemas"]["updateRegistrationFlowWithOidcMethod"] | components["schemas"]["updateRegistrationFlowWithWebAuthnMethod"] | components["schemas"]["updateRegistrationFlowWithCodeMethod"] | components["schemas"]["updateRegistrationFlowWithPasskeyMethod"] | components["schemas"]["updateRegistrationFlowWithProfileMethod"];
      /** @description Update Registration Flow with Code Method */
      updateRegistrationFlowWithCodeMethod: {
        /** @description The OTP Code sent to the user */
        code?: string;
        /** @description The CSRF Token */
        csrf_token?: string;
        /**
         * @description Method to use
         *
         *     This field must be set to `code` when using the code method. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "code";
        /** @description Resend restarts the flow with a new code */
        resend?: string;
        /** @description The identity's traits */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Registration Flow with OpenID Connect Method */
      updateRegistrationFlowWithOidcMethod: {
        /** @description The CSRF Token */
        csrf_token?: string;
        /**
         * @description IDToken is an optional id token provided by an OIDC provider
         *
         *     If submitted, it is verified using the OIDC provider's public key set and the claims are used to populate
         *     the OIDC credentials of the identity.
         *     If the OIDC provider does not store additional claims (such as name, etc.) in the IDToken itself, you can use
         *     the `traits` field to populate the identity's traits. Note, that Apple only includes the users email in the IDToken.
         *
         *     Supported providers are
         *     Apple
         *     Google
         */
        id_token?: string;
        /**
         * @description IDTokenNonce is the nonce, used when generating the IDToken.
         *     If the provider supports nonce validation, the nonce will be validated against this value and is required.
         */
        id_token_nonce?: string;
        /**
         * @description Method to use
         *
         *     This field must be set to `oidc` when using the oidc method. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "oidc";
        /** @description The provider to register with */
        provider: string;
        /** @description The identity traits */
        traits?: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description UpstreamParameters are the parameters that are passed to the upstream identity provider.
         *
         *     These parameters are optional and depend on what the upstream identity provider supports.
         *     Supported parameters are:
         *     `login_hint` (string): The `login_hint` parameter suppresses the account chooser and either pre-fills the email box on the sign-in form, or selects the proper session.
         *     `hd` (string): The `hd` parameter limits the login/registration process to a Google Organization, e.g. `mycollege.edu`.
         *     `prompt` (string): The `prompt` specifies whether the Authorization Server prompts the End-User for reauthentication and consent, e.g. `select_account`.
         */
        upstream_parameters?: Record<string, never>;
      };
      /** @description Update Registration Flow with Passkey Method */
      updateRegistrationFlowWithPasskeyMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to "passkey" when trying to add, update, or remove a Passkey. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "passkey";
        /**
         * @description Register a WebAuthn Security Key
         *
         *     It is expected that the JSON returned by the WebAuthn registration process
         *     is included here.
         */
        passkey_register?: string;
        /** @description The identity's traits */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Registration Flow with Password Method */
      updateRegistrationFlowWithPasswordMethod: {
        /** @description The CSRF Token */
        csrf_token?: string;
        /**
         * @description Method to use
         *
         *     This field must be set to `password` when using the password method. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "password";
        /** @description Password to sign the user up with */
        password: string;
        /** @description The identity's traits */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Registration Flow with Profile Method */
      updateRegistrationFlowWithProfileMethod: {
        /**
         * @description The Anti-CSRF Token
         *
         *     This token is only required when performing browser flows.
         */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to profile when trying to update a profile. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "profile";
        /**
         * @description Screen requests navigation to a previous screen.
         *
         *     This must be set to credential-selection to go back to the credential
         *     selection screen.
         *     credential-selection RegistrationScreenCredentialSelection nolint:gosec // not a credential
         *     previous RegistrationScreenPrevious
         * @enum {string}
         */
        screen?: "credential-selection" | "previous";
        /**
         * @description Traits
         *
         *     The identity's traits.
         */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Registration Flow with WebAuthn Method */
      updateRegistrationFlowWithWebAuthnMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to "webauthn" when trying to add, update, or remove a webAuthn pairing. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "webauthn";
        /** @description The identity's traits */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description Register a WebAuthn Security Key
         *
         *     It is expected that the JSON returned by the WebAuthn registration process
         *     is included here.
         */
        webauthn_register?: string;
        /**
         * @description Name of the WebAuthn Security Key to be Added
         *
         *     A human-readable name for the security key which will be added.
         */
        webauthn_register_displayname?: string;
      };
      /** @description Update Settings Flow Request Body */
      updateSettingsFlowBody: components["schemas"]["updateSettingsFlowWithPasswordMethod"] | components["schemas"]["updateSettingsFlowWithProfileMethod"] | components["schemas"]["updateSettingsFlowWithOidcMethod"] | components["schemas"]["updateSettingsFlowWithTotpMethod"] | components["schemas"]["updateSettingsFlowWithWebAuthnMethod"] | components["schemas"]["updateSettingsFlowWithLookupMethod"] | components["schemas"]["updateSettingsFlowWithPasskeyMethod"];
      /** @description Update Settings Flow with Lookup Method */
      updateSettingsFlowWithLookupMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /** @description If set to true will save the regenerated lookup secrets */
        lookup_secret_confirm?: boolean;
        /** @description Disables this method if true. */
        lookup_secret_disable?: boolean;
        /** @description If set to true will regenerate the lookup secrets */
        lookup_secret_regenerate?: boolean;
        /** @description If set to true will reveal the lookup secrets */
        lookup_secret_reveal?: boolean;
        /**
         * @description Method
         *
         *     Should be set to "lookup" when trying to add, update, or remove a lookup pairing. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "lookup_secret";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Settings Flow with OpenID Connect Method */
      updateSettingsFlowWithOidcMethod: {
        /**
         * @description Flow ID is the flow's ID.
         *
         *     in: query
         */
        flow?: string;
        /**
         * @description Link this provider
         *
         *     Either this or `unlink` must be set.
         *
         *     type: string
         *     in: body
         */
        link?: string;
        /**
         * @description Method
         *
         *     Should be set to profile when trying to update a profile. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "oidc";
        /**
         * @description The identity's traits
         *
         *     in: body
         */
        traits?: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description Unlink this provider
         *
         *     Either this or `link` must be set.
         *
         *     type: string
         *     in: body
         */
        unlink?: string;
        /**
         * @description UpstreamParameters are the parameters that are passed to the upstream identity provider.
         *
         *     These parameters are optional and depend on what the upstream identity provider supports.
         *     Supported parameters are:
         *     `login_hint` (string): The `login_hint` parameter suppresses the account chooser and either pre-fills the email box on the sign-in form, or selects the proper session.
         *     `hd` (string): The `hd` parameter limits the login/registration process to a Google Organization, e.g. `mycollege.edu`.
         *     `prompt` (string): The `prompt` specifies whether the Authorization Server prompts the End-User for reauthentication and consent, e.g. `select_account`.
         */
        upstream_parameters?: Record<string, never>;
      };
      /** @description Update Settings Flow with Passkey Method */
      updateSettingsFlowWithPasskeyMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to "passkey" when trying to add, update, or remove a webAuthn pairing. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "passkey";
        /**
         * @description Remove a WebAuthn Security Key
         *
         *     This must contain the ID of the WebAuthN connection.
         */
        passkey_remove?: string;
        /**
         * @description Register a WebAuthn Security Key
         *
         *     It is expected that the JSON returned by the WebAuthn registration process
         *     is included here.
         */
        passkey_settings_register?: string;
      };
      /** @description Update Settings Flow with Password Method */
      updateSettingsFlowWithPasswordMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to password when trying to update a password. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "password";
        /** @description Password is the updated password */
        password: string;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Settings Flow with Profile Method */
      updateSettingsFlowWithProfileMethod: {
        /**
         * @description The Anti-CSRF Token
         *
         *     This token is only required when performing browser flows.
         */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to profile when trying to update a profile. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "profile";
        /**
         * @description Traits
         *
         *     The identity's traits.
         */
        traits: Record<string, never>;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Settings Flow with TOTP Method */
      updateSettingsFlowWithTotpMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to "totp" when trying to add, update, or remove a totp pairing. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "totp";
        /** @description ValidationTOTP must contain a valid TOTP based on the */
        totp_code?: string;
        /**
         * @description UnlinkTOTP if true will remove the TOTP pairing,
         *     effectively removing the credential. This can be used
         *     to set up a new TOTP device.
         */
        totp_unlink?: boolean;
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Settings Flow with WebAuthn Method */
      updateSettingsFlowWithWebAuthnMethod: {
        /** @description CSRFToken is the anti-CSRF token */
        csrf_token?: string;
        /**
         * @description Method
         *
         *     Should be set to "webauthn" when trying to add, update, or remove a webAuthn pairing. (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "webauthn";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
        /**
         * @description Register a WebAuthn Security Key
         *
         *     It is expected that the JSON returned by the WebAuthn registration process
         *     is included here.
         */
        webauthn_register?: string;
        /**
         * @description Name of the WebAuthn Security Key to be Added
         *
         *     A human-readable name for the security key which will be added.
         */
        webauthn_register_displayname?: string;
        /**
         * @description Remove a WebAuthn Security Key
         *
         *     This must contain the ID of the WebAuthN connection.
         */
        webauthn_remove?: string;
      };
      /** @description Update Verification Flow Request Body */
      updateVerificationFlowBody: components["schemas"]["updateVerificationFlowWithLinkMethod"] | components["schemas"]["updateVerificationFlowWithCodeMethod"];
      updateVerificationFlowWithCodeMethod: {
        /**
         * @description Code from the recovery email
         *
         *     If you want to submit a code, use this field, but make sure to _not_ include the email field, as well.
         */
        code?: string;
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description The email address to verify
         *
         *     If the email belongs to a valid account, a verifiation email will be sent.
         *
         *     If you want to notify the email address if the account does not exist, see
         *     the [notify_unknown_recipients flag](https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation#attempted-verification-notifications)
         *
         *     If a code was already sent, including this field in the payload will invalidate the sent code and re-send a new code.
         *
         *     format: email
         */
        email?: string;
        /**
         * @description Method is the method that should be used for this verification flow
         *
         *     Allowed values are `link` and `code`.
         *     link VerificationStrategyLink
         *     code VerificationStrategyCode (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "code";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description Update Verification Flow with Link Method */
      updateVerificationFlowWithLinkMethod: {
        /** @description Sending the anti-csrf token is only required for browser login flows. */
        csrf_token?: string;
        /**
         * @description Email to Verify
         *
         *     Needs to be set when initiating the flow. If the email is a registered
         *     verification email, a verification link will be sent. If the email is not known,
         *     a email with details on what happened will be sent instead.
         *
         *     format: email
         */
        email: string;
        /**
         * @description Method is the method that should be used for this verification flow
         *
         *     Allowed values are `link` and `code`
         *     link VerificationStrategyLink
         *     code VerificationStrategyCode (enum property replaced by openapi-typescript)
         * @enum {string}
         */
        method: "link";
        /** @description Transient data to pass along to any webhooks */
        transient_payload?: Record<string, never>;
      };
      /** @description VerifiableAddress is an identity's verifiable address */
      verifiableIdentityAddress: {
        /**
         * Format: date-time
         * @description When this entry was created
         * @example 2014-01-01T23:28:56.782Z
         */
        created_at?: string;
        /**
         * Format: uuid
         * @description The ID
         */
        id?: string;
        status: components["schemas"]["identityVerifiableAddressStatus"];
        /**
         * Format: date-time
         * @description When this entry was last updated
         * @example 2014-01-01T23:28:56.782Z
         */
        updated_at?: string;
        /**
         * @description The address value
         *
         *     example foo@user.com
         */
        value: string;
        /**
         * @description Indicates if the address has already been verified
         * @example true
         */
        verified: boolean;
        verified_at?: components["schemas"]["nullTime"];
        /**
         * @description The delivery method
         * @example email
         * @enum {string}
         */
        via: "email" | "sms";
      };
      /**
       * A Verification Flow
       * @description Used to verify an out-of-band communication
       *     channel such as an email address or a phone number.
       *
       *     For more information head over to: https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation
       */
      verificationFlow: {
        /**
         * @description Active, if set, contains the registration method that is being used. It is initially
         *     not set.
         */
        active?: string;
        /**
         * Format: date-time
         * @description ExpiresAt is the time (UTC) when the request expires. If the user still wishes to verify the address,
         *     a new request has to be initiated.
         */
        expires_at?: string;
        /**
         * Format: uuid
         * @description ID represents the request's unique ID. When performing the verification flow, this
         *     represents the id in the verify ui's query parameter: http://<selfservice.flows.verification.ui_url>?request=<id>
         *
         *     type: string
         *     format: uuid
         */
        id: string;
        /**
         * Format: date-time
         * @description IssuedAt is the time (UTC) when the request occurred.
         */
        issued_at?: string;
        /**
         * @description RequestURL is the initial URL that was requested from Ory Kratos. It can be used
         *     to forward information contained in the URL's path or query for example.
         */
        request_url?: string;
        /** @description ReturnTo contains the requested return_to URL. */
        return_to?: string;
        /**
         * @description State represents the state of this request:
         *
         *     choose_method: ask the user to choose a method (e.g. verify your email)
         *     sent_email: the email has been sent to the user
         *     passed_challenge: the request was successful and the verification challenge was passed.
         */
        state: unknown;
        /** @description TransientPayload is used to pass data from the verification flow to hooks and email templates */
        transient_payload?: Record<string, never>;
        type: components["schemas"]["selfServiceFlowType"];
        ui: components["schemas"]["uiContainer"];
      };
      /**
       * Verification flow state (experimental)
       * @description The experimental state represents the state of a verification flow. This field is EXPERIMENTAL and subject to change!
       * @enum {unknown}
       */
      verificationFlowState: "choose_method" | "sent_email" | "passed_challenge";
      version: {
        /** @description Version is the service's version. */
        version?: string;
      };
      webAuthnJavaScript: string;
    };
    responses: {
      /** @description Empty responses are sent when, for example, resources are deleted. The HTTP status code for empty responses is typically 204. */
      emptyResponse: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description List Identity JSON Schemas Response */
      identitySchemas: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["identitySchemas"];
        };
      };
      /** @description Paginated Courier Message List Response */
      listCourierMessages: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["message"][];
        };
      };
      /** @description Paginated Identity List Response */
      listIdentities: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["identity"][];
        };
      };
      /** @description List Identity Sessions Response */
      listIdentitySessions: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["session"][];
        };
      };
      /** @description List My Session Response */
      listMySessions: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["session"][];
        };
      };
      /**
       * @description Session List Response
       *
       *     The response given when listing sessions in an administrative context.
       */
      listSessions: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["session"][];
        };
      };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
  }
  export type $defs = Record<string, never>;
  export interface operations {
    getWebAuthnJavaScript: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description webAuthnJavaScript */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["webAuthnJavaScript"];
          };
        };
      };
    };
    listCourierMessages: {
      parameters: {
        query?: {
          /**
           * @description Items per Page
           *
           *     This is the number of items per page to return.
           *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token.
           *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
          /**
           * @description Status filters out messages based on status.
           *     If no value is provided, it doesn't take effect on filter.
           */
          status?: components["schemas"]["courierMessageStatus"];
          /**
           * @description Recipient filters out messages based on recipient.
           *     If no value is provided, it doesn't take effect on filter.
           */
          recipient?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["listCourierMessages"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getCourierMessage: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description MessageID is the ID of the message. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description message */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["message"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    listIdentities: {
      parameters: {
        query?: {
          /**
           * @description Deprecated Items per Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This is the number of items per page.
           */
          per_page?: number;
          /**
           * @description Deprecated Pagination Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This value is currently an integer, but it is not sequential. The value is not the page number, but a
           *     reference. The next page can be any number and some numbers might return an empty list.
           *
           *     For example, page 2 might not follow after page 1. And even if page 3 and 5 exist, but page 4 might not exist.
           *     The first page can be retrieved by omitting this parameter. Following page pointers will be returned in the
           *     `Link` header.
           */
          page?: number;
          /**
           * @description Page Size
           *
           *     This is the number of items per page to return. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
          /**
           * @description Read Consistency Level (preview)
           *
           *     The read consistency level determines the consistency guarantee for reads:
           *
           *     strong (slow): The read is guaranteed to return the most recent data committed at the start of the read.
           *     eventual (very fast): The result will return data that is about 4.8 seconds old.
           *
           *     The default consistency guarantee can be changed in the Ory Network Console or using the Ory CLI with
           *     `ory patch project --replace '/previews/default_read_consistency_level="strong"'`.
           *
           *     Setting the default consistency level to `eventual` may cause regressions in the future as we add consistency
           *     controls to more APIs. Currently, the following APIs will be affected by this setting:
           *
           *     `GET /admin/identities`
           *
           *     This feature is in preview and only available in Ory Network.
           *      ConsistencyLevelUnset  ConsistencyLevelUnset is the unset / default consistency level.
           *     strong ConsistencyLevelStrong  ConsistencyLevelStrong is the strong consistency level.
           *     eventual ConsistencyLevelEventual  ConsistencyLevelEventual is the eventual consistency level using follower read timestamps.
           */
          consistency?: "" | "strong" | "eventual";
          /**
           * @description Retrieve multiple identities by their IDs.
           *
           *     This parameter has the following limitations:
           *
           *     Duplicate or non-existent IDs are ignored.
           *     The order of returned IDs may be different from the request.
           *     This filter does not support pagination. You must implement your own pagination as the maximum number of items returned by this endpoint may not exceed a certain threshold (currently 500).
           */
          ids?: string[];
          /**
           * @description CredentialsIdentifier is the identifier (username, email) of the credentials to look up using exact match.
           *     Only one of CredentialsIdentifier and CredentialsIdentifierSimilar can be used.
           */
          credentials_identifier?: string;
          /**
           * @description This is an EXPERIMENTAL parameter that WILL CHANGE. Do NOT rely on consistent, deterministic behavior.
           *     THIS PARAMETER WILL BE REMOVED IN AN UPCOMING RELEASE WITHOUT ANY MIGRATION PATH.
           *
           *     CredentialsIdentifierSimilar is the (partial) identifier (username, email) of the credentials to look up using similarity search.
           *     Only one of CredentialsIdentifier and CredentialsIdentifierSimilar can be used.
           */
          preview_credentials_identifier_similar?: string;
          /**
           * @description Include Credentials in Response
           *
           *     Include any credential, for example `password` or `oidc`, in the response. When set to `oidc`, This will return
           *     the initial OAuth 2.0 Access Token, OAuth 2.0 Refresh Token and the OpenID Connect ID Token if available.
           */
          include_credential?: string[];
          /** @description List identities that belong to a specific organization. */
          organization_id?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["listIdentities"];
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createIdentity: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["createIdentityBody"];
        };
      };
      responses: {
        /** @description identity */
        201: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["identity"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        409: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    batchPatchIdentities: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["patchIdentitiesBody"];
        };
      };
      responses: {
        /** @description batchPatchIdentitiesResponse */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["batchPatchIdentitiesResponse"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        409: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getIdentity: {
      parameters: {
        query?: {
          /**
           * @description Include Credentials in Response
           *
           *     Include any credential, for example `password` or `oidc`, in the response. When set to `oidc`, This will return
           *     the initial OAuth 2.0 Access Token, OAuth 2.0 Refresh Token and the OpenID Connect ID Token if available.
           */
          include_credential?: ("password" | "oidc" | "totp" | "lookup_secret" | "webauthn" | "code" | "passkey" | "profile" | "saml" | "link_recovery" | "code_recovery")[];
        };
        header?: never;
        path: {
          /** @description ID must be set to the ID of identity you want to get */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description identity */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["identity"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateIdentity: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID must be set to the ID of identity you want to update */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["updateIdentityBody"];
        };
      };
      responses: {
        /** @description identity */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["identity"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        409: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    deleteIdentity: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID is the identity's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    patchIdentity: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID must be set to the ID of identity you want to update */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["jsonPatchDocument"];
        };
      };
      responses: {
        /** @description identity */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["identity"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        409: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    deleteIdentityCredentials: {
      parameters: {
        query?: {
          /**
           * @description Identifier is the identifier of the OIDC credential to delete.
           *     Find the identifier by calling the `GET /admin/identities/{id}?include_credential=oidc` endpoint.
           */
          identifier?: string;
        };
        header?: never;
        path: {
          /** @description ID is the identity's ID. */
          id: string;
          /**
           * @description Type is the type of credentials to delete.
           *     password CredentialsTypePassword
           *     oidc CredentialsTypeOIDC
           *     totp CredentialsTypeTOTP
           *     lookup_secret CredentialsTypeLookup
           *     webauthn CredentialsTypeWebAuthn
           *     code CredentialsTypeCodeAuth
           *     passkey CredentialsTypePasskey
           *     profile CredentialsTypeProfile
           *     saml CredentialsTypeSAML
           *     link_recovery CredentialsTypeRecoveryLink  CredentialsTypeRecoveryLink is a special credential type linked to the link strategy (recovery flow).  It is not used within the credentials object itself.
           *     code_recovery CredentialsTypeRecoveryCode
           */
          type: "password" | "oidc" | "totp" | "lookup_secret" | "webauthn" | "code" | "passkey" | "profile" | "saml" | "link_recovery" | "code_recovery";
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    listIdentitySessions: {
      parameters: {
        query?: {
          /**
           * @description Deprecated Items per Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This is the number of items per page.
           */
          per_page?: number;
          /**
           * @description Deprecated Pagination Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This value is currently an integer, but it is not sequential. The value is not the page number, but a
           *     reference. The next page can be any number and some numbers might return an empty list.
           *
           *     For example, page 2 might not follow after page 1. And even if page 3 and 5 exist, but page 4 might not exist.
           *     The first page can be retrieved by omitting this parameter. Following page pointers will be returned in the
           *     `Link` header.
           */
          page?: number;
          /**
           * @description Page Size
           *
           *     This is the number of items per page to return. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
          /** @description Active is a boolean flag that filters out sessions based on the state. If no value is provided, all sessions are returned. */
          active?: boolean;
        };
        header?: never;
        path: {
          /** @description ID is the identity's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["listIdentitySessions"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    deleteIdentitySessions: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID is the identity's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createRecoveryCodeForIdentity: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["createRecoveryCodeForIdentityBody"];
        };
      };
      responses: {
        /** @description recoveryCodeForIdentity */
        201: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryCodeForIdentity"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createRecoveryLinkForIdentity: {
      parameters: {
        query?: {
          return_to?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["createRecoveryLinkForIdentityBody"];
        };
      };
      responses: {
        /** @description recoveryLinkForIdentity */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryLinkForIdentity"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    listSessions: {
      parameters: {
        query?: {
          /**
           * @description Items per Page
           *
           *     This is the number of items per page to return.
           *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token.
           *     For details on pagination please head over to the [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
          /** @description Active is a boolean flag that filters out sessions based on the state. If no value is provided, all sessions are returned. */
          active?: boolean;
          /**
           * @description ExpandOptions is a query parameter encoded list of all properties that must be expanded in the Session.
           *     If no value is provided, the expandable properties are skipped.
           */
          expand?: ("identity" | "devices")[];
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["listSessions"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getSession: {
      parameters: {
        query?: {
          /**
           * @description ExpandOptions is a query parameter encoded list of all properties that must be expanded in the Session.
           *     Example - ?expand=Identity&expand=Devices
           *     If no value is provided, the expandable properties are skipped.
           */
          expand?: ("identity" | "devices")[];
        };
        header?: never;
        path: {
          /** @description ID is the session's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description session */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["session"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    disableSession: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID is the session's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    extendSession: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID is the session's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description session */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["session"];
          };
        };
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    isAlive: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description Ory Kratos is ready to accept connections. */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": {
              /** @description Always "ok". */
              status: string;
            };
          };
        };
        /** @description Unexpected error */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "text/plain": string;
          };
        };
      };
    };
    isReady: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description Ory Kratos is ready to accept requests. */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": {
              /** @description Always "ok". */
              status: string;
            };
          };
        };
        /** @description Ory Kratos is not yet ready to accept requests. */
        503: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": {
              /** @description Errors contains a list of errors that caused the not ready status. */
              errors: {
                [key: string]: string;
              };
            };
          };
        };
        /** @description Unexpected error */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "text/plain": string;
          };
        };
      };
    };
    listIdentitySchemas: {
      parameters: {
        query?: {
          /**
           * @description Deprecated Items per Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This is the number of items per page.
           */
          per_page?: number;
          /**
           * @description Deprecated Pagination Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This value is currently an integer, but it is not sequential. The value is not the page number, but a
           *     reference. The next page can be any number and some numbers might return an empty list.
           *
           *     For example, page 2 might not follow after page 1. And even if page 3 and 5 exist, but page 4 might not exist.
           *     The first page can be retrieved by omitting this parameter. Following page pointers will be returned in the
           *     `Link` header.
           */
          page?: number;
          /**
           * @description Page Size
           *
           *     This is the number of items per page to return. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["identitySchemas"];
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getIdentitySchema: {
      parameters: {
        query?: never;
        header?: never;
        path: {
          /** @description ID must be set to the ID of schema you want to get */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description identitySchema */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["identitySchema"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getFlowError: {
      parameters: {
        query: {
          /** @description Error is the error's ID */
          id: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description flowError */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["flowError"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        500: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createFedcmFlow: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description createFedcmFlowResponse */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["createFedcmFlowResponse"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateFedcmFlow: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["UpdateFedcmFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["UpdateFedcmFlowBody"];
        };
      };
      responses: {
        /** @description successfulNativeLogin */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["successfulNativeLogin"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description loginFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["loginFlow"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorBrowserLocationChangeRequired */
        422: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorBrowserLocationChangeRequired"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateLoginFlow: {
      parameters: {
        query: {
          /**
           * @description The Login Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/login?flow=abcde`).
           */
          flow: string;
        };
        header?: {
          /** @description The Session Token of the Identity performing the settings flow. */
          "X-Session-Token"?: string;
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["updateLoginFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["updateLoginFlowBody"];
        };
      };
      responses: {
        /** @description successfulNativeLogin */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["successfulNativeLogin"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description loginFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["loginFlow"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorBrowserLocationChangeRequired */
        422: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorBrowserLocationChangeRequired"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createNativeLoginFlow: {
      parameters: {
        query?: {
          /**
           * @description Refresh a login session
           *
           *     If set to true, this will refresh an existing login session by
           *     asking the user to sign in again. This will reset the
           *     authenticated_at time of the session.
           */
          refresh?: boolean;
          /**
           * @description Request a Specific AuthenticationMethod Assurance Level
           *
           *     Use this parameter to upgrade an existing session's authenticator assurance level (AAL). This
           *     allows you to ask for multi-factor authentication. When an identity sign in using e.g. username+password,
           *     the AAL is 1. If you wish to "upgrade" the session's security by asking the user to perform TOTP / WebAuth/ ...
           *     you would set this to "aal2".
           */
          aal?: string;
          /**
           * @description EnableSessionTokenExchangeCode requests the login flow to include a code that can be used to retrieve the session token
           *     after the login flow has been completed.
           */
          return_session_token_exchange_code?: boolean;
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
          /**
           * @description An optional organization ID that should be used for logging this user in.
           *     This parameter is only effective in the Ory Network.
           */
          organization?: string;
          /**
           * @description Via should contain the identity's credential the code should be sent to. Only relevant in aal2 flows.
           *
           *     DEPRECATED: This field is deprecated. Please remove it from your requests. The user will now see a choice
           *     of MFA credentials to choose from to perform the second factor instead.
           */
          via?: string;
        };
        header?: {
          /** @description The Session Token of the Identity performing the settings flow. */
          "X-Session-Token"?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description loginFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["loginFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserLoginFlow: {
      parameters: {
        query?: {
          /**
           * @description Refresh a login session
           *
           *     If set to true, this will refresh an existing login session by
           *     asking the user to sign in again. This will reset the
           *     authenticated_at time of the session.
           */
          refresh?: boolean;
          /**
           * @description Request a Specific AuthenticationMethod Assurance Level
           *
           *     Use this parameter to upgrade an existing session's authenticator assurance level (AAL). This
           *     allows you to ask for multi-factor authentication. When an identity sign in using e.g. username+password,
           *     the AAL is 1. If you wish to "upgrade" the session's security by asking the user to perform TOTP / WebAuth/ ...
           *     you would set this to "aal2".
           */
          aal?: string;
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
          /**
           * @description An optional Hydra login challenge. If present, Kratos will cooperate with
           *     Ory Hydra to act as an OAuth2 identity provider.
           *
           *     The value for this parameter comes from `login_challenge` URL Query parameter sent to your
           *     application (e.g. `/login?login_challenge=abcde`).
           */
          login_challenge?: string;
          /**
           * @description An optional organization ID that should be used for logging this user in.
           *     This parameter is only effective in the Ory Network.
           */
          organization?: string;
          /**
           * @description Via should contain the identity's credential the code should be sent to. Only relevant in aal2 flows.
           *
           *     DEPRECATED: This field is deprecated. Please remove it from your requests. The user will now see a choice
           *     of MFA credentials to choose from to perform the second factor instead.
           */
          via?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description loginFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["loginFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getLoginFlow: {
      parameters: {
        query: {
          /**
           * @description The Login Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/login?flow=abcde`).
           */
          id: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description loginFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["loginFlow"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateLogoutFlow: {
      parameters: {
        query?: {
          /**
           * @description A Valid Logout Token
           *
           *     If you do not have a logout token because you only have a session cookie,
           *     call `/self-service/logout/browser` to generate a URL for this endpoint.
           */
          token?: string;
          /** @description The URL to return to after the logout was completed. */
          return_to?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    performNativeLogout: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["performNativeLogoutBody"];
        };
      };
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserLogoutFlow: {
      parameters: {
        query?: {
          /**
           * @description Return to URL
           *
           *     The URL to which the browser should be redirected to after the logout
           *     has been performed.
           */
          return_to?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     If you call this endpoint from a backend, please include the
           *     original Cookie header in the request.
           */
          cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description logoutFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["logoutFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        500: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateRecoveryFlow: {
      parameters: {
        query: {
          /**
           * @description The Recovery Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/recovery?flow=abcde`).
           */
          flow: string;
          /**
           * @description Recovery Token
           *
           *     The recovery token which completes the recovery request. If the token
           *     is invalid (e.g. expired) an error will be shown to the end-user.
           *
           *     This parameter is usually set in a link and not used by any direct API call.
           */
          token?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["updateRecoveryFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["updateRecoveryFlowBody"];
        };
      };
      responses: {
        /** @description recoveryFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description recoveryFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryFlow"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorBrowserLocationChangeRequired */
        422: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorBrowserLocationChangeRequired"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createNativeRecoveryFlow: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description recoveryFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserRecoveryFlow: {
      parameters: {
        query?: {
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description recoveryFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getRecoveryFlow: {
      parameters: {
        query: {
          /**
           * @description The Flow ID
           *
           *     The value for this parameter comes from `request` URL Query parameter sent to your
           *     application (e.g. `/recovery?flow=abcde`).
           */
          id: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description recoveryFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["recoveryFlow"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateRegistrationFlow: {
      parameters: {
        query: {
          /**
           * @description The Registration Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/registration?flow=abcde`).
           */
          flow: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["updateRegistrationFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["updateRegistrationFlowBody"];
        };
      };
      responses: {
        /** @description successfulNativeRegistration */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["successfulNativeRegistration"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description registrationFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["registrationFlow"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorBrowserLocationChangeRequired */
        422: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorBrowserLocationChangeRequired"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createNativeRegistrationFlow: {
      parameters: {
        query?: {
          /**
           * @description EnableSessionTokenExchangeCode requests the login flow to include a code that can be used to retrieve the session token
           *     after the login flow has been completed.
           */
          return_session_token_exchange_code?: boolean;
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
          /**
           * @description An optional organization ID that should be used to register this user.
           *     This parameter is only effective in the Ory Network.
           */
          organization?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description registrationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["registrationFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserRegistrationFlow: {
      parameters: {
        query?: {
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
          /**
           * @description Ory OAuth 2.0 Login Challenge.
           *
           *     If set will cooperate with Ory OAuth2 and OpenID to act as an OAuth2 server / OpenID Provider.
           *
           *     The value for this parameter comes from `login_challenge` URL Query parameter sent to your
           *     application (e.g. `/registration?login_challenge=abcde`).
           *
           *     This feature is compatible with Ory Hydra when not running on the Ory Network.
           */
          login_challenge?: string;
          /**
           * @description The URL to return the browser to after the verification flow was completed.
           *
           *     After the registration flow is completed, the user will be sent a verification email.
           *     Upon completing the verification flow, this URL will be used to override the default
           *     `selfservice.flows.verification.after.default_redirect_to` value.
           */
          after_verification_return_to?: string;
          /**
           * @description An optional organization ID that should be used to register this user.
           *     This parameter is only effective in the Ory Network.
           */
          organization?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description registrationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["registrationFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getRegistrationFlow: {
      parameters: {
        query: {
          /**
           * @description The Registration Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/registration?flow=abcde`).
           */
          id: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description registrationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["registrationFlow"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateSettingsFlow: {
      parameters: {
        query: {
          /**
           * @description The Settings Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/settings?flow=abcde`).
           */
          flow: string;
        };
        header?: {
          /** @description The Session Token of the Identity performing the settings flow. */
          "X-Session-Token"?: string;
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["updateSettingsFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["updateSettingsFlowBody"];
        };
      };
      responses: {
        /** @description settingsFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["settingsFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description settingsFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["settingsFlow"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorBrowserLocationChangeRequired */
        422: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorBrowserLocationChangeRequired"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createNativeSettingsFlow: {
      parameters: {
        query?: never;
        header?: {
          /** @description The Session Token of the Identity performing the settings flow. */
          "X-Session-Token"?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description settingsFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["settingsFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserSettingsFlow: {
      parameters: {
        query?: {
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description settingsFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["settingsFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getSettingsFlow: {
      parameters: {
        query: {
          /**
           * @description ID is the Settings Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/settings?flow=abcde`).
           */
          id: string;
        };
        header?: {
          /**
           * @description The Session Token
           *
           *     When using the SDK in an app without a browser, please include the
           *     session token here.
           */
          "X-Session-Token"?: string;
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description settingsFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["settingsFlow"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    updateVerificationFlow: {
      parameters: {
        query: {
          /**
           * @description The Verification Flow ID
           *
           *     The value for this parameter comes from `flow` URL Query parameter sent to your
           *     application (e.g. `/verification?flow=abcde`).
           */
          flow: string;
          /**
           * @description Verification Token
           *
           *     The verification token which completes the verification request. If the token
           *     is invalid (e.g. expired) an error will be shown to the end-user.
           *
           *     This parameter is usually set in a link and not used by any direct API call.
           */
          token?: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK in a browser app, on the server side you must include the HTTP Cookie Header
           *     sent by the client to your server here. This ensures that CSRF and session cookies are respected.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["updateVerificationFlowBody"];
          "application/x-www-form-urlencoded": components["schemas"]["updateVerificationFlowBody"];
        };
      };
      responses: {
        /** @description verificationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["verificationFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description verificationFlow */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["verificationFlow"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createNativeVerificationFlow: {
      parameters: {
        query?: {
          /**
           * @description A URL contained in the return_to key of the verification flow.
           *     This piece of data has no effect on the actual logic of the flow and is purely informational.
           */
          return_to?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description verificationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["verificationFlow"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    createBrowserVerificationFlow: {
      parameters: {
        query?: {
          /** @description The URL to return the browser to after the flow was completed. */
          return_to?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description verificationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["verificationFlow"];
          };
        };
        303: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getVerificationFlow: {
      parameters: {
        query: {
          /**
           * @description The Flow ID
           *
           *     The value for this parameter comes from `request` URL Query parameter sent to your
           *     application (e.g. `/verification?flow=abcde`).
           */
          id: string;
        };
        header?: {
          /**
           * @description HTTP Cookies
           *
           *     When using the SDK on the server side you must include the HTTP Cookie Header
           *     originally sent to your HTTP handler here.
           */
          cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description verificationFlow */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["verificationFlow"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    listMySessions: {
      parameters: {
        query?: {
          /**
           * @description Deprecated Items per Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This is the number of items per page.
           */
          per_page?: number;
          /**
           * @description Deprecated Pagination Page
           *
           *     DEPRECATED: Please use `page_token` instead. This parameter will be removed in the future.
           *
           *     This value is currently an integer, but it is not sequential. The value is not the page number, but a
           *     reference. The next page can be any number and some numbers might return an empty list.
           *
           *     For example, page 2 might not follow after page 1. And even if page 3 and 5 exist, but page 4 might not exist.
           *     The first page can be retrieved by omitting this parameter. Following page pointers will be returned in the
           *     `Link` header.
           */
          page?: number;
          /**
           * @description Page Size
           *
           *     This is the number of items per page to return. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_size?: number;
          /**
           * @description Next Page Token
           *
           *     The next page token. For details on pagination please head over to the
           *     [pagination documentation](https://www.ory.sh/docs/ecosystem/api-design#pagination).
           */
          page_token?: string;
        };
        header?: {
          /** @description Set the Session Token when calling from non-browser clients. A session token has a format of `MP2YWEMeM8MxjkGKpH4dqOQ4Q4DlSPaj`. */
          "X-Session-Token"?: string;
          /**
           * @description Set the Cookie Header. This is especially useful when calling this endpoint from a server-side application. In that
           *     scenario you must include the HTTP Cookie Header which originally was included in the request to your server.
           *     An example of a session in the HTTP Cookie Header is: `ory_kratos_session=a19iOVAbdzdgl70Rq1QZmrKmcjDtdsviCTZx7m9a9yHIUS8Wa9T7hvqyGTsLHi6Qifn2WUfpAKx9DWp0SJGleIn9vh2YF4A16id93kXFTgIgmwIOvbVAScyrx7yVl6bPZnCx27ec4WQDtaTewC1CpgudeDV2jQQnSaCP6ny3xa8qLH-QUgYqdQuoA_LF1phxgRCUfIrCLQOkolX5nv3ze_f==`.
           *
           *     It is ok if more than one cookie are included here as all other cookies will be ignored.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: components["responses"]["listMySessions"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    disableMyOtherSessions: {
      parameters: {
        query?: never;
        header?: {
          /** @description Set the Session Token when calling from non-browser clients. A session token has a format of `MP2YWEMeM8MxjkGKpH4dqOQ4Q4DlSPaj`. */
          "X-Session-Token"?: string;
          /**
           * @description Set the Cookie Header. This is especially useful when calling this endpoint from a server-side application. In that
           *     scenario you must include the HTTP Cookie Header which originally was included in the request to your server.
           *     An example of a session in the HTTP Cookie Header is: `ory_kratos_session=a19iOVAbdzdgl70Rq1QZmrKmcjDtdsviCTZx7m9a9yHIUS8Wa9T7hvqyGTsLHi6Qifn2WUfpAKx9DWp0SJGleIn9vh2YF4A16id93kXFTgIgmwIOvbVAScyrx7yVl6bPZnCx27ec4WQDtaTewC1CpgudeDV2jQQnSaCP6ny3xa8qLH-QUgYqdQuoA_LF1phxgRCUfIrCLQOkolX5nv3ze_f==`.
           *
           *     It is ok if more than one cookie are included here as all other cookies will be ignored.
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description deleteMySessionsCount */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["deleteMySessionsCount"];
          };
        };
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    exchangeSessionToken: {
      parameters: {
        query: {
          /** @description The part of the code return when initializing the flow. */
          init_code: string;
          /** @description The part of the code returned by the return_to URL. */
          return_to_code: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description successfulNativeLogin */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["successfulNativeLogin"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        410: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    toSession: {
      parameters: {
        query?: {
          /**
           * @description Returns the session additionally as a token (such as a JWT)
           *
           *     The value of this parameter has to be a valid, configured Ory Session token template. For more information head over to [the documentation](http://ory.sh/docs/identities/session-to-jwt-cors).
           */
          tokenize_as?: string;
        };
        header?: {
          /**
           * @description Set the Session Token when calling from non-browser clients. A session token has a format of `MP2YWEMeM8MxjkGKpH4dqOQ4Q4DlSPaj`.
           * @example MP2YWEMeM8MxjkGKpH4dqOQ4Q4DlSPaj
           */
          "X-Session-Token"?: string;
          /**
           * @description Set the Cookie Header. This is especially useful when calling this endpoint from a server-side application. In that
           *     scenario you must include the HTTP Cookie Header which originally was included in the request to your server.
           *     An example of a session in the HTTP Cookie Header is: `ory_kratos_session=a19iOVAbdzdgl70Rq1QZmrKmcjDtdsviCTZx7m9a9yHIUS8Wa9T7hvqyGTsLHi6Qifn2WUfpAKx9DWp0SJGleIn9vh2YF4A16id93kXFTgIgmwIOvbVAScyrx7yVl6bPZnCx27ec4WQDtaTewC1CpgudeDV2jQQnSaCP6ny3xa8qLH-QUgYqdQuoA_LF1phxgRCUfIrCLQOkolX5nv3ze_f==`.
           *
           *     It is ok if more than one cookie are included here as all other cookies will be ignored.
           * @example ory_session=a19iOVAbdzdgl70Rq1QZmrKmcjDtdsviCTZx7m9a9yHIUS8Wa9T7hvqyGTsLHi6Qifn2WUfpAKx9DWp0SJGleIn9vh2YF4A16id93kXFTgIgmwIOvbVAScyrx7yVl6bPZnCx27ec4WQDtaTewC1CpgudeDV2jQQnSaCP6ny3xa8qLH-QUgYqdQuoA_LF1phxgRCUfIrCLQOkolX5nv3ze_f==
           */
          Cookie?: string;
        };
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description session */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["session"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        403: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    disableMySession: {
      parameters: {
        query?: never;
        header?: {
          /** @description Set the Session Token when calling from non-browser clients. A session token has a format of `MP2YWEMeM8MxjkGKpH4dqOQ4Q4DlSPaj`. */
          "X-Session-Token"?: string;
          /**
           * @description Set the Cookie Header. This is especially useful when calling this endpoint from a server-side application. In that
           *     scenario you must include the HTTP Cookie Header which originally was included in the request to your server.
           *     An example of a session in the HTTP Cookie Header is: `ory_kratos_session=a19iOVAbdzdgl70Rq1QZmrKmcjDtdsviCTZx7m9a9yHIUS8Wa9T7hvqyGTsLHi6Qifn2WUfpAKx9DWp0SJGleIn9vh2YF4A16id93kXFTgIgmwIOvbVAScyrx7yVl6bPZnCx27ec4WQDtaTewC1CpgudeDV2jQQnSaCP6ny3xa8qLH-QUgYqdQuoA_LF1phxgRCUfIrCLQOkolX5nv3ze_f==`.
           *
           *     It is ok if more than one cookie are included here as all other cookies will be ignored.
           */
          Cookie?: string;
        };
        path: {
          /** @description ID is the session's ID. */
          id: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        204: components["responses"]["emptyResponse"];
        /** @description errorGeneric */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
        /** @description errorGeneric */
        default: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": components["schemas"]["errorGeneric"];
          };
        };
      };
    };
    getVersion: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description Returns the Ory Kratos version. */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            "application/json": {
              /** @description The version of Ory Kratos. */
              version: string;
            };
          };
        };
      };
    };
  }
}
