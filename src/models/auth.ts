import authService from 'services/auth'
import { RootDispatch, RootState } from 'app/store';
import * as ls from 'local-storage'

export interface AuthState {
    isInit: boolean,
    isLoading: boolean,
    isError: boolean,
    error?: string | undefined,
    credentials?: Credentials | undefined
}

let authInitialState: AuthState = {
    isInit: true,
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
    idToken?: string | undefined,
    expiresIn?: number | undefined,
    issuedAt?: number | undefined

}

const STORAGE_KEY = 'auth';
export const auth = {  
    state: authInitialState,
    reducers: {
        setTokenLoading(state: AuthState, loading: boolean) {
            return { ...state, loading };
        },
        setTokenError(_: AuthState, error: string) {
            return { isAuthorized: false, isLoading: false, isError: true, isInit: false, error };
        },
        setToken(_: AuthState, credentials: Credentials) {
            return { credentials, isLoading: false, isInit: false
                , isError: false };
        },
        resetToken(_: AuthState) {
            return authInitialState;
        }
    },
    effects: (dispatch: RootDispatch) => ({
        async init() {
            const credentials = ls.get<Credentials>(STORAGE_KEY);
            dispatch.auth.setToken(credentials)
        },
        async login(credentials: UserCredentials) {
            const { userName, password } = credentials;
            dispatch.auth.setTokenLoading(true);
            try {
                const { refreshToken, accessToken, idToken, expiresIn, issuedAt, } = await authService.makeTokenRequest(userName, password);
                const credentials = { refreshToken, accessToken, idToken, expiresIn, issuedAt };
                dispatch.auth.setToken(credentials);
                ls.set<Credentials>(STORAGE_KEY, credentials);
            } catch (error) {
                dispatch.auth.setTokenError(error);
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
                    ls.set<Credentials>(STORAGE_KEY, newCredentials);
                } catch (error) {
                    dispatch.auth.setTokenError(error);
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
                } catch (error) {
                    dispatch.auth.setTokenError(error);
                }
                ls.remove(STORAGE_KEY);
            }
        }
    })
}