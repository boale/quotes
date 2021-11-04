
export type RepoResult<T> = CollectionResult<T>

export interface Repo<T> {
  find<C, O>(criteria: C, opts: O): Promise<RepoResult<T|T[]>>;

  findOne(id: string): Promise<RepoResult<T>>;

  update(id: string, data: Partial<T>): Promise<RepoResult<boolean>>;

  delete(id: string): Promise<RepoResult<boolean>>;
}

export abstract class BaseRepo<T> implements Repo<T> {

  find<C, O>(criteria: C, opts: O): Promise<RepoResult<T[] | T>> {
    throw new Error('Not implemented');
  }

  findOne(id: string): Promise<RepoResult<T>> {
    throw new Error('Not implemented');
  }

  update(id: string, data: Partial<T>): Promise<RepoResult<boolean>> {
    throw new Error('Not implemented');
  }

  delete(id: string): Promise<RepoResult<boolean>> {
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
