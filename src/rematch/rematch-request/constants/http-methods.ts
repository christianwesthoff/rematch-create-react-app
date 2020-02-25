const HttpMethods = {
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

export type HttpMethods = typeof HttpMethods;

export type HttpMethod = keyof HttpMethods;

export default HttpMethods;
