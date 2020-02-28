import { AxiosRequestConfig } from "axios";

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

const configureMockApi = () => {
    const mock = new MockAdapter(axios, { delayResponse: 100 });
    mock
        .onPost(`${process.env.REACT_APP_OAUTH_TOKEN_ENDPOINT}`).reply(200, {
            "access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2RDNFNDZFOTEwNzNDNUQ0QkMyQzk5ODNCRTlGRjQ0OENGNjQwRDQiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJCdFBrYnBFSFBGMUx3c21ZTy1uX1JJejJRTlEifQ.eyJuYmYiOjE1ODI4MjUyNzQsImV4cCI6MTU4MjgyODg3NCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImNsaWVudF9pZCI6InJlc291cmNlb3duZXJjbGllbnQiLCJzdWIiOiIxMjMiLCJhdXRoX3RpbWUiOjE1ODI4MjUyNzQsImlkcCI6ImxvY2FsIiwicm9sZSI6WyJkYXRhRXZlbnRSZWNvcmRzLmFkbWluIiwiZGF0YUV2ZW50UmVjb3Jkcy51c2VyIl0sInVzZXJuYW1lIjoiZGFtaWVuYm9kIiwiZW1haWwiOiJkYW1pZW5ib2RAZW1haWwuY2giLCJzY29wZSI6WyJlbWFpbCIsIm9wZW5pZCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.SidwOH6YT8pCUjbtSKA6InwnsDwWvoodGMn57ITDQEnCW_WfqjfC1cyg0DxYsZRkNAlH0ZmFdP4whhmHU1_6Pwc8aCzY2u9uHyTNdH5z66ORop7_Hb0aZfXmJOGls83jaM8etlwMLTC3ww3ajxLs7gyldewEEJzwtDe6Iroevb_i-1peAR0mJX7ejjgw-xAdHlXdA0XytHIjT4NQ7dVsDddy4oo6BzrUtZX4281uX5TRi-p5fBEG7ZJPeN1_sXx8lGlnqBH-wMd_oD171ieAtD1sHRQ3iKBRtsHwXKrm0swjGQIpuMnf-sqG30fkJ0h_mkggJr7Vtud2JJJ3SL1s9w",
            "expires_in":3600,
            "token_type":"Bearer",
            "refresh_token":"o3GJTQzXSJg6RuLcgfUDKoEfKb-h1N_dG_8tHV4G6YE",
            "scope":"email offline_access openid"
        }, { 'content-type': 'application/json' })
        .onGet(`${process.env.REACT_APP_OAUTH_CLIENT_USER_INFO}`).reply(200, {
            "firstname": "Michael",
            "lastname": "Müller"
        }, { 'content-type': 'application/json' })
        .onPost(`${process.env.REACT_APP_OAUTH_REVOCATION_ENDPOINT}`).reply(200)
        .onAny().reply((config: AxiosRequestConfig) => {
            // pipe but delete fake authorization header
            const headers: any = { ...config.headers };
            delete headers["authorization"];
            return mock.originalAdapter({ ...config, headers });
        });
}

export default configureMockApi;