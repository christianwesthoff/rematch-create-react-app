import { NetworkInterface, RequestHeaders } from "./types";
import HttpMethods, { HttpMethod } from './constants/http-methods';
import axios, { AxiosInstance, CancelToken } from 'axios';

const buildCancelToken = () => {
  var source = axios.CancelToken.source();
  return { token: source.token, cancel: source.cancel }
};

const buildRequest = (instance: AxiosInstance, url: string, method: HttpMethod, body: any) => {
    switch (method) {
      case HttpMethods.HEAD:
        return instance.head(url, body);
      case HttpMethods.GET:
        return instance.get(url, body);
      case HttpMethods.POST:
        return instance.post(url, body);
      case HttpMethods.PUT:
        return instance.put(url, body);
      case HttpMethods.PATCH:
        return instance.patch(url, body);
      case HttpMethods.DELETE:
        return instance.delete(url, body);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };
  
const buildInstance = (headers?: RequestHeaders, withCredentials?: boolean, cancelToken?: CancelToken, baseUrl?: string): AxiosInstance => axios.create({
    baseURL: baseUrl,
    withCredentials,
    headers,
    cancelToken
});

const axiosInterface: NetworkInterface = (
    url,
    method,
    { body, headers, credentials } = {},
) => {

    const { token, cancel } = buildCancelToken();
    const instance = buildInstance(headers, credentials === 'include', token);
    const request = buildRequest(instance, url, method, body);

    const execute = (cb: any) =>
      request.then(function (response) {
          const resStatus = (response && response.status) || 0;
          const resBody = (response && response.data) || undefined;
          const resHeaders = (response && response.headers) || undefined;
          cb(undefined, resStatus, resBody, undefined, resHeaders);
        })
        .catch(function (error) {
          if (error.response) {
            cb(error, error.response.status, error.response.data, undefined, error.response.headers);
          } else {
            cb(error);
          }
        });

    const abort = () => cancel();

    return {
      abort,
      execute,
    };
};

export default axiosInterface;