import {
    AuthorizationNotifier,
    AuthorizationServiceConfiguration,
    LocalStorageBackend,
    LocationLike,
    RedirectRequestHandler,
    BasicQueryStringUtils,
    StringMap,
    TokenRequest,
    BaseTokenRequestHandler,
    RevokeTokenRequest,
    GRANT_TYPE_REFRESH_TOKEN,
  } from '@openid/appauth';
import { AxiosRequestor } from './axiosRequestor';

const GRANT_TYPE_PASSWORD = 'password';

class StringUtils extends BasicQueryStringUtils {
  parse(input: LocationLike, useHash?: boolean | undefined): StringMap {
    return super.parse(input, false);
  }
}

class CustomTokenRequestHandler extends BaseTokenRequestHandler {
  performRevokeTokenRequest(
    configuration: AuthorizationServiceConfiguration,
    request: RevokeTokenRequest
  ): Promise<boolean> {
    return this.requestor
      .xhr<boolean>({
        url: configuration.revocationEndpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${request.token}`,
          Accept: 'application/json',
        },
        data: this.utils.stringify(request.toStringMap()),
      })
      .then(() => true)
      .catch(() => true);
  }
}

export class AuthService {
  notifier: AuthorizationNotifier;
  handler: RedirectRequestHandler;
  config: AuthorizationServiceConfiguration;
  tokenHandler: CustomTokenRequestHandler;

  constructor() {
    this.notifier = new AuthorizationNotifier();
    this.handler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new StringUtils()
    );
    this.tokenHandler = new CustomTokenRequestHandler(new AxiosRequestor());
    this.config = new AuthorizationServiceConfiguration({
      authorization_endpoint: `${process.env.REACT_APP_OAUTH_AUTHORIZATION_ENDPOINT}`,
      token_endpoint: `${process.env.REACT_APP_OAUTH_TOKEN_ENDPOINT}`,
      revocation_endpoint: `${process.env.REACT_APP_OAUTH_REVOCATION_ENDPOINT}`,
    });

    this.handler.setAuthorizationNotifier(this.notifier);
  }

  // makeAuthorizationRequest() {
  //   const request = new AuthorizationRequest({
  //     client_id: `${process.env.REACT_APP_CLIENT_ID}`,
  //     redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}`,
  //     scope: '*',
  //     response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
  //     state: undefined,
  //     extras: {},
  //   });

  //   this.handler.performAuthorizationRequest(this.config, request);
  // }

  makeTokenRequest(userName: string, password: string, scope?: string | undefined) {
    if (!userName) {
      return Promise.reject(new Error('Missing userName'));
    }

    if (!password) {
      return Promise.reject(new Error('Missing password'));
    }

    const request = new TokenRequest({
      client_id: `${process.env.REACT_APP_OAUTH_CLIENT_ID}`,
      redirect_uri: ``,
      grant_type: GRANT_TYPE_PASSWORD,
      code: undefined,
      refresh_token: undefined,
      extras: Object.assign({}, 
        { 'username': userName }, 
        { 'password': password }, 
        { 'scope': scope }, 
        { 'client_secret': `${process.env.REACT_APP_OAUTH_CLIENT_SECRET}` }),
    });

    return this.tokenHandler.performTokenRequest(this.config, request);
  }

  makeRefreshTokenRequest(refreshToken: string) {
    const request = new TokenRequest({
      client_id: `resourceownerclient`,
      redirect_uri: ``,
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      code: undefined,
      refresh_token: refreshToken,
      extras: undefined,
    });

    return this.tokenHandler.performTokenRequest(this.config, request);
  }

  makeRevokeTokenRequest(token: string) {
    const request = new RevokeTokenRequest({
      token,
      token_type_hint: 'refresh_token',
      client_id: `${process.env.REACT_APP_OAUTH_CLIENT_ID}`,
      client_secret: `${process.env.REACT_APP_OAUTH_CLIENT_SECRET}`,
    });

    return this.tokenHandler.performRevokeTokenRequest(this.config, request);
  }

  checkForAuthorizationResponse() {
    return this.handler.completeAuthorizationRequestIfPossible();
  }

  getAuthorizationResponse() {
    return new Promise((resolve, reject) => {
      this.notifier.setAuthorizationListener((request, response, error) => {
        if (error) {
          reject(error);
        }

        if (response && response.code) {
          resolve({
            code: response.code,
            verifier: request?.internal?.code_verifier || '',
          });
        }

        reject(null);
      });
    });
  }
}

export default new AuthService();