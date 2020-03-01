import { Requestor, AppAuthError } from '@openid/appauth';
import axios, { AxiosRequestConfig, Method } from 'axios'

export class AxiosRequestor extends Requestor {
    xhr<T>(settings: JQueryAjaxSettings): Promise<T> {
      if (!settings.url) {
        return Promise.reject(new AppAuthError('A URL must be provided.'));
      }
      let url: URL = new URL(settings.url as string);
      let requestInit: AxiosRequestConfig = {};
      requestInit.method = settings.method as Method;
  
      if (settings.data) {
        if (settings.method && settings.method.toUpperCase() === 'POST') {
          requestInit.data = settings.data as string;
        } else {
          let searchParams = new URLSearchParams(settings.data);
          searchParams.forEach((value, key) => {
            url.searchParams.append(key, value);
          });
        }
      }
  
      // Set the request headers
      requestInit.headers = {};
      if (settings.headers) {
        for (let i in settings.headers) {
          if (settings.headers.hasOwnProperty(i)) {
            requestInit.headers[i] = settings.headers[i] as string;
          }
        }
      }
  
      const isJsonDataType = settings.dataType && settings.dataType.toLowerCase() === 'json';
  
      // Set 'Accept' header value for json requests (Taken from
      // https://github.com/jquery/jquery/blob/e0d941156900a6bff7c098c8ea7290528e468cf8/src/ajax.js#L644
      // )
      if (isJsonDataType) {
        requestInit.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
      }
  
      return axios(url.toString(), requestInit).then(response => {
        if (response.status >= 200 && response.status < 300) {
          const contentType = response.headers['content-type'];
          if (isJsonDataType || (contentType && contentType.indexOf('application/json') !== -1)) {
            return response.data;
          }
          return undefined;
        } else {
          return Promise.reject(new AppAuthError(response.status.toString(), response.statusText));
        }
      })
    }
  }