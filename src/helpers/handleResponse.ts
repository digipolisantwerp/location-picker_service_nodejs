import { Response, RequestCallback } from "request";

const getProp = require('lodash.get');

export type handleResponseFn<T> = (error: any, result?: Array<T>) => any;

export function handleResponse<T>(
  key: string, 
  mapper: (v: any) => T, 
  callback: handleResponseFn<T>
): RequestCallback {
  return (error: any, response: Response, body: any) => {
    if (error || (body && body.error) || typeof body === 'string') {
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
      return callback(error || body);
    }
    const docs = getProp(body, key);
    if (response.statusCode >= 400 || !docs) {
      return callback({ status: response.statusCode || 500 });
    }

    return callback(null, docs.map(mapper));
  };
}