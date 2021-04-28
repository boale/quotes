import { ApiResponseData } from '@quotes/api-interfaces';

export * from './array.utils';
export * from './env.utils';

export function mapToApiResponseData<T, E = null>(data: T, statusCode = 200, message = 'OK', error?: E): ApiResponseData<T, E> {
  return {  data,  message, statusCode, error };
}

export function convertQueryDataToArray<T = unknown>(queryData: unknown, sep = ','): T[] | string[] | unknown[] {
  if (Array.isArray(queryData)) {
    return queryData.reduce((memo, data) => ([ ...memo, ...convertQueryDataToArray<T>(data)]), []);
  }

  if(typeof queryData === 'string') {
    return queryData.split(sep);
  }

  return [ queryData ];
}

