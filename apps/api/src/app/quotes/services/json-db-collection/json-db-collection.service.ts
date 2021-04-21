import { Injectable, Logger } from "@nestjs/common";

import { v4 } from 'uuid';

import {
  BaseRepo,
  CollectionResult,
  ForceOpts,
  SearchCriteria,
  SoftDeleteFlag,
  TimeStamps,
  WithId,
} from './models';
import {
  doesRecordMatchCriteria,
  isEmptyRecord,
  mapCollectionToArray,
  mapToCollectionResult,
  sliceAndSort
} from './utils';

@Injectable()
export class JsonDbCollectionService<T> extends BaseRepo<T> {
  constructor(private logger: Logger) {
    super()
  }

  find<S = unknown>({ where, limit, page = 0, sortBy, order }: SearchCriteria<S> = {}): Promise<CollectionResult<T>> {
    return this.loadCollection()
      .then(() => {
        const collectionArray = mapCollectionToArray<T>(this.collectionRecords);
        if (isEmptyRecord(where as Record<string, unknown>)) {
          const sorted = sliceAndSort<T>(collectionArray, { page, limit, sortBy, order });

          return mapToCollectionResult<T>(sorted, { page, limit, total: collectionArray.length })
        }

        if (limit === 1) {
          return mapToCollectionResult<T>(collectionArray.find((q: T): boolean => {
            return doesRecordMatchCriteria<T, S>(q, { where });
          }), { limit: 1, page: 0, total: 1 })
        }

        const collection = collectionArray.filter((q: T): boolean => doesRecordMatchCriteria<T, S>(q, { where }))
        const sorted = sliceAndSort<T>(collection, { page, limit, sortBy, order });

        return mapToCollectionResult<T>(sorted, { page, limit, total: collection.length });
      });
  }

  findById(id: string): Promise<CollectionResult<T>> {
    return this.loadCollection().then(() => mapToCollectionResult<T>(this.collectionRecords[ id ]));
  }

  update(id: string, data: Partial<T&SoftDeleteFlag>|SoftDeleteFlag): Promise<CollectionResult<boolean>> {
    // TODO: handle case when isSynced = false;
    if (!(id && data)) {
      return Promise.reject(new Error(`${ !id ? 'id' : 'data'} has not been provided.`));
    }

    const collectionRecord = this.collectionRecords[ id ];
    if (!collectionRecord) {
      return Promise.reject(new Error(`Record with id=${ id } has not been found.`));
    }

    // TODO: add validation
    const recordData: T = {
      ...collectionRecord,
      ...data,
      updatedAt: Date.now(),
    }

    return this.loadCollection()
      .then(() => {
        this.collectionRecords[ id ] = { ...recordData };
        this.isSynced = false;

        return this.syncCollection();
      })
      .then(() => mapToCollectionResult<boolean>(true))
      .catch((err) => {
        this.logger.error(err);

        return mapToCollectionResult<boolean>(false);
      });
  }

  create(data: Partial<T&SoftDeleteFlag>): Promise<CollectionResult<boolean>> {
    if (!data) {
      return Promise.reject(new Error('Data has not been provided'));
    }

    const id = v4();
    // TODO: handle relations
    // TODO: validation
    const recordData = {
      ...data,
      id,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.loadCollection().then(() => {
      this.collectionRecords[ id ] = recordData as T&WithId&SoftDeleteFlag&TimeStamps;
      this.isSynced = false;

      return this.syncCollection()
        .then(() => mapToCollectionResult<boolean>(true))
        .catch((err) => {
          this.logger.error(err);

          return mapToCollectionResult<boolean>(false);
        });
    });
  }

  delete(id: string, { force = false }: ForceOpts = {}): Promise<CollectionResult<boolean>> {
    // TODO: handle case when isSynced = false;
    const quoteRecord = this.collectionRecords[ id ];
    if (!quoteRecord) {
      return Promise.reject(new Error(`Record with id=${ id } has not been found.`));
    }

    if (force) {
      delete this.collectionRecords[ id ];
    } else {
      return this.update(id, { isDeleted: true });
    }

    this.isSynced = false;

    return this.syncCollection()
      .then(() => mapToCollectionResult<boolean>(true))
      .catch((err) => {
        this.logger.error(err);

        return mapToCollectionResult<boolean>(false);
      });
  }
}
