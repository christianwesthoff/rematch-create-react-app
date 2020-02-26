import { RootDispatch } from 'app/store';
import axios from 'axios';

export interface Claims {
    [key: string]: string|Array<string>
}

export interface UserInfoState {
    claims?: Claims | undefined,
    isError: boolean,
    isLoading: boolean,
    error?: string | undefined
}

const claimsInitialState: UserInfoState = {
    isError: false,
    isLoading: false
}

export const userInfo = {  
    state: claimsInitialState,
    reducers: {
        setClaimsLoading(state: UserInfoState, loading: boolean) {
            return { ...state, loading };
        },
        setClaimsError(_: UserInfoState, error: string) {
            return { claims: {}, isLoading: false, isError: true, error };
        },
        setClaims(_: UserInfoState, claims: Claims) {
            return { claims, isLoading: false, isError: false };
        },
        resetClaims(_: UserInfoState) {
            return claimsInitialState;
        }
    },
    effects: (dispatch: RootDispatch) => ({
        async fetch(accessToken: string) {
            dispatch.userInfo.setClaimsLoading(true);
            try {
                const response = await axios.get<Claims>(`${process.env.REACT_APP_OAUTH_CLIENT_ID}`, { headers: { authorization: `Bearer ${accessToken}` } });
                dispatch.userInfo.setClaims(response.data);
            } catch (error) {
                dispatch.userInfo.setClaimsError(error);
            }
        }
    })
}