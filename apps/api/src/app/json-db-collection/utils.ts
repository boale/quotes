import {PathLike} from "fs";
import {readFile, writeFile} from "fs/promises";

import {
  CollectionRecords,
  CollectionResult,
  PageLimitTotalOpts,
  ResultReturnOptions,
  SearchCriteria,
  SortOrder, ValueCheckerFn, WithId
} from "./models";

export const PROP_VALUE_CHECK_MAP: { [ type: string ]: ValueCheckerFn<unknown> } = {
  undefined: ((current, expected) => Object.is(current, expected)) as ValueCheckerFn<undefined>,
  boolean: ((current, expected) => Object.is(current, expected)) as ValueCheckerFn<boolean>,
  string: ((current, expected, { strict = false } = {}) => {
    return strict ? current === expected : current.includes(expected);
  }) as ValueCheckerFn<string>,
  object: ((current, expected, { strict = false } = {}) => {
    if (Array.isArray(current) && Array.isArray(expected)) {
      if (strict) {
        return (current.length === expected.length) && current.reduce((memo, val) => {
          return memo && expected.includes(val);
        }, true)
      }

      return expected.reduce((memo, val) => (memo && current.includes(val)), true);
    }

    return Object.is(current, expected); // TODO: object equal check
  }) as ValueCheckerFn<Record<string, unknown>>,
}

export function doesRecordMatchCriteria<T, S>(record: T, criteria: SearchCriteria<S>, schema?: any): boolean {
  const { where } = criteria;

  if (!where) {
    return true;
  }

  return Object.entries(where)
    .reduce((memo: boolean, [ prop, value ]: [ string, string|string[]|boolean|unknown ]) => {
      const recordPropValue = record[ prop ];

      if (typeof value === 'undefined') {
        return memo && true;
      }

      return memo && prop in record && PROP_VALUE_CHECK_MAP[ typeof recordPropValue ](recordPropValue, value);
    }, true);
}

export function mapArrayToCollection<T>(data: T[]): CollectionRecords<T> {
  return data.reduce((memo: CollectionRecords<T>, item: T&WithId) => {
    return {
      ...memo,
      [ item.id ]: { ...item },
    };
  }, {});
}

export function mapCollectionToArray<T>(collection: CollectionRecords<T>): T[] {
  return Object.values(collection);
}

export function readJson<T>(path: PathLike): Promise<T> {
  return readFile(path, { encoding: 'utf-8' })
    .then((fileStr: string) => (JSON.parse(fileStr) as T));
}

export function writeJson<T>(path: PathLike, data: T): Promise<void> {
  try {
    const dataStr = JSON.stringify(data);

    return writeFile(this.quotesJsonPath, dataStr, {encoding: 'utf-8'});
  } catch (e) {
    return Promise.reject(e);
  }
}

export function mapToCollectionResult<T>(data: T|T[], { page, limit, total }: PageLimitTotalOpts = {}): CollectionResult<T> {
  if (typeof data === 'boolean') {
    return {
      result: data,
    };
  }

  if (data && !Array.isArray(data)) {
    return {
      result: data,
      resultCount: 1,
    };
  }

  return {
    result: data,
    resultCount: Array.isArray(data) && data.length || 0,
    ...{ total, page,  limit },
  };
}

export function sliceAndSort<T>(data: T[], { page = 0, limit, sortBy, order }: ResultReturnOptions = {}): T[] {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const exactPage = (!pageNumber || pageNumber - 1 <= 0) ? 0 : pageNumber - 1;
  const startFromIndex = limitNumber * exactPage;
  const endWithIndex = startFromIndex + limitNumber;

  const dataSlice = limit ? data.slice(startFromIndex, endWithIndex) : data;

  return sortBy
    ? dataSlice.sort((first: T, second: T): number => {
      const firstFieldValue = first[sortBy];
      const secondFieldValue = second[sortBy];

      if (!sortBy || firstFieldValue === secondFieldValue) {
        return 0;
      }

      if (order === SortOrder.ASC) {
        return firstFieldValue > secondFieldValue ? 1 : -1;
      }

      return firstFieldValue < secondFieldValue ? 1 : -1;
    })
    : dataSlice;
}

export function isEmptyRecord(data: Record<string, unknown>): boolean {
  if (Array.isArray(data)) {
    return !!data.length;
  }

  return !Object
    .keys(data)
    .find(key => {
      const value = data[ key ];

      return typeof value === 'boolean' || typeof value === 'string' || !!value;
    });
}
