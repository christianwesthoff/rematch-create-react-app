import { NetworkInterface } from "./types";
import HttpMethods, { HttpMethod } from './constants/http-methods';
import superagent from 'superagent';

const createRequest = (url: string, method: HttpMethod, body: any) => {
    switch (method) {
      case HttpMethods.HEAD:
        return superagent.head(url, body);
      case HttpMethods.GET:
        return superagent.get(url, body);
      case HttpMethods.POST:
        return superagent.post(url, body);
      case HttpMethods.PUT:
        return superagent.put(url, body);
      case HttpMethods.PATCH:
        return superagent.patch(url, body);
      case HttpMethods.DELETE:
        return superagent.delete(url, body);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };
  
  const superagentNetworkInterface: NetworkInterface = (
    url,
    method,
    { body, headers, credentials } = {},
  ) => {
    const request = createRequest(url, method, body);
  
    if (headers) {
      request.set(headers);
    }
  
    if (credentials === 'include') {
      request.withCredentials();
    }
  
    const execute = (cb: any) =>
      request.end((err, response) => {
        const resStatus = (response && response.status) || 0;
        const resBody = (response && response.body) || undefined;
        const resText = (response && response.text) || undefined;
        const resHeaders = (response && response.header) || undefined;
  
        cb(err, resStatus, resBody, resText, resHeaders);
      });
  
    const abort = () => request.abort();
  
    return {
      abort,
      execute,
    };
  };
  
  export default superagentNetworkInterface;