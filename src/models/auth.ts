import AuthService from 'services/auth'
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
    accessToken?: string | undefined
}


const authService = new AuthService();
export const auth = {  
    state: authInitialState,
    reducers: {
        setLoading(_: AuthState) {
            return { isAuthorized: false, isLoading: true, isError: false, isInit: false };
        },
        setError(_: AuthState, error: string) {
            return { isAuthorized: false, isLoading: false, isError: true, isInit: false, error };
        },
        setToken(_: AuthState, credentials: Credentials) {
            return { credentials, isLoading: false, isInit: false
                , isError: false };
        },
        reset(_: AuthState) {
            return authInitialState;
        }
    },
    effects: (dispatch: RootDispatch) => ({
        async init() {
            const credentials = ls.get<Credentials>("auth");
            dispatch.auth.setToken(credentials)
        },
        async login(credentials: UserCredentials) {
            const { userName, password } = credentials;
            dispatch.auth.setLoading();
            try {
                const { refreshToken, accessToken } = await authService.makeTokenRequest(userName, password);
                dispatch.auth.setToken({ refreshToken, accessToken });
                ls.set<Credentials>("auth", { refreshToken, accessToken });
            } catch (error) {
                dispatch.auth.setError(error);
            }
        },
        async refresh(rootState: RootState) {
            const { credentials } = rootState.auth;
            if (credentials) {
                const { refreshToken } = credentials;
                dispatch.auth.setLoading();
                try {
                    const { accessToken } = await authService.makeRefreshTokenRequest(refreshToken!);
                    dispatch.auth.setToken({ refreshToken, accessToken });
                    ls.set<Credentials>("auth", { refreshToken, accessToken });
                } catch (error) {
                    dispatch.auth.setError(error);
                }
            }
        },
        async logout(rootState: RootState) {
            const { credentials } = rootState.auth;
            if (credentials) {
                const { refreshToken } = credentials;
                dispatch.auth.setLoading();
                try {
                    await authService.makeRevokeTokenRequest(refreshToken!);
                    dispatch.auth.reset();
                } catch (error) {
                    dispatch.auth.setError(error);
                }
                ls.remove("auth");
            }
        }
    })
}