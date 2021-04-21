import {PathLike} from "fs";
import {mapArrayToCollection, mapCollectionToArray, readJson, writeJson} from "./utils";

export interface Repo<T> {
  find<C, O>(criteria: C, opts: O): Promise<CollectionResult<T|T[]>>;

  findOne(id: string): Promise<CollectionResult<T>>;

  update(id: string, data: Partial<T>): Promise<CollectionResult<boolean>>;

  delete(id: string): Promise<CollectionResult<boolean>>;
}

// TODO: complete Repository Pattern...
export abstract class BaseRepo<T> implements Repo<T> {
  protected collectionRecords: CollectionRecords<T|T&WithId&TimeStamps&SoftDeleteFlag> = {}
  protected collectionPath: string | PathLike;
  isLoaded = false;
  isSynced = false;

  loadCollection(path?: string | PathLike) {
    if (this.isLoaded || this.collectionPath) {
      return Promise.resolve();
    }

    this.collectionPath = path;

    return readJson<T[]>(this.collectionPath)
      .then((data: T[]) => {
        this.collectionRecords = { ...mapArrayToCollection<T>(data) };
        this.isLoaded = true;
        this.isSynced = true;
      });
  }

  syncCollection(): Promise<void | Error> {
    if (this.isSynced) {
      return Promise.resolve();
    }

    return writeJson<T[]>(this.collectionPath, mapCollectionToArray<T>(this.collectionRecords))
      .then(() => {
        this.isSynced = true;
        // this.isLoaded = false;
      });
  }


  find<C, O>(criteria: C, opts: O): Promise<CollectionResult<T[] | T>> {
    throw new Error('Not implemented');
  }

  findOne(id: string): Promise<CollectionResult<T>> {
    throw new Error('Not implemented');
  }

  update(id: string, data: Partial<T>): Promise<CollectionResult<boolean>> {
    throw new Error('Not implemented');
  }

  delete(id: string): Promise<CollectionResult<boolean>> {
    throw new Error('Not implemented');
  }
}

export interface PageLimit {
  limit?: number;
  page?: number;
}

export interface PageLimitTotalOpts extends PageLimit {
  total?: number;
}

export interface ResultReturnOptions extends PageLimit {
  sortBy?: string;
  order?: SortOrder
}

export interface SearchCriteria<T> extends ResultReturnOptions{
  where?: T;
}

export interface CollectionResult<T> {
  result: T | T[] | null;
  resultCount?: number;
  error?: Error;
  limit?: number;
  page?: number;
  total?: number;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ForceOpts {
  force?: boolean;
}

export interface StrictOpts {
  strict?: boolean;
}

export type ValueCheckerFn<T> = (current: T, expected: T, opts?: StrictOpts ) => boolean;

export interface CollectionRecords<T> {
  [ id: string ]: T;
}

export interface WithId {
  id?: string;
}

export interface SoftDeleteFlag {
  isDeleted?: boolean;
}

export interface TimeStamps {
  createdAt: number,
  updatedAt: null,
}
