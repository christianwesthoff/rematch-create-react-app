import authService from 'services/auth';
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
        async login(rootState: RootState, login: UserCredentials) {
            const { userName, password } = login;
            dispatch.auth.setTokenLoading(true);
            try {
                const { refreshToken, accessToken, expiresIn } = await authService.makeTokenRequest(userName, password, 'openid profile identity_api offline_access');
                if (accessToken) {
                    dispatch.userInfo.fetchClaims(accessToken);
                }
                dispatch.auth.setToken({ refreshToken, accessToken, expiresIn });
                const { action, location } = rootState.router;
                if (action === 'REPLACE' && location.state && location.state.from) {
                    dispatch.router.replace(location.state.from);
                } else {
                    dispatch.router.push('/');
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
                    const { accessToken, expiresIn } = await authService.makeRefreshTokenRequest(refreshToken);
                    if (accessToken) {
                        dispatch.userInfo.fetchClaims(accessToken);
                    }
                    dispatch.auth.setToken({ ...credentials, accessToken, expiresIn });
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
                    dispatch.userInfo.resetClaims();
                    dispatch.auth.resetToken();
                } catch (error) {
                    dispatch.auth.setTokenError(error.toString());
                }
            }
        }
    })
}