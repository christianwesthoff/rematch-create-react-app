import authService from 'services/auth'
import { RootDispatch, RootState } from 'store';

export interface AuthState {
    isAuthorized: boolean,
    isLoading: boolean,
    isError: boolean,
    error?: string | undefined,
    credentials?: Credentials | undefined
}

let authInitialState: AuthState = {
    isAuthorized: false,
    isLoading: false,
    isError: false
}

export interface UserCredentials {
    userName: string,
    password: string
}

export interface Credentials {
    refreshToken?: string | undefined,
    accessToken?: string | undefined,
    expiresIn?: number | undefined,
}

export type UserLogin = UserCredentials & {
    redirect?: boolean | undefined
}

export const auth = {  
    state: authInitialState,
    reducers: {
        setTokenLoading(_: AuthState, isLoading: boolean): AuthState {
            return { isError: true, isLoading, isAuthorized: false };
        },
        setTokenError(_: AuthState, error: string): AuthState {
            return { isAuthorized: false, isLoading: false, isError: true, error };
        },
        setToken(_: AuthState, credentials?: Credentials | undefined) : AuthState {
            return { credentials, isAuthorized: !!credentials, isLoading: false, isError: false };
        },
        resetToken(_: AuthState) : AuthState {
            return { isLoading: false, isError: false, isAuthorized: false };
        }
    },
    effects: (dispatch: RootDispatch) => ({
        async login(login: UserLogin) {
            const { userName, password, redirect } = login;
            dispatch.auth.setTokenLoading(true);
            try {
                const { refreshToken, accessToken, expiresIn } = await authService.makeTokenRequest(userName, password, 'email openid offline_access');
                const credentials = { refreshToken, accessToken, expiresIn };
                if (credentials && credentials.accessToken) {
                    await dispatch.userInfo.fetch(credentials.accessToken);
                }
                dispatch.auth.setToken(credentials);
                if (redirect) {
                    (dispatch as any).router.goBack();
                }
            } catch (error) {
                dispatch.auth.setTokenError(error.toString());
            }
        },
        async refresh(rootState: RootState) {
            const { credentials } = rootState.auth;
            if (credentials && credentials.refreshToken) {
                const { refreshToken } = credentials;
                dispatch.auth.setTokenLoading(true);
                try {
                    const { accessToken } = await authService.makeRefreshTokenRequest(refreshToken);
                    const newCredentials = { ...credentials, accessToken };
                    dispatch.auth.setToken(newCredentials);
                } catch (error) {
                    dispatch.auth.setTokenError(error.toString());
                }
            }
        },
        async logout(rootState: RootState) {
            const { credentials } = rootState.auth;
            if (credentials && credentials.refreshToken) {
                const { refreshToken } = credentials;
                dispatch.auth.setTokenLoading(true);
                try {
                    await authService.makeRevokeTokenRequest(refreshToken);
                    dispatch.auth.resetToken();
                    dispatch.userInfo.resetClaims();
                } catch (error) {
                    dispatch.auth.setTokenError(error.toString());
                }
            }
        }
    })
}