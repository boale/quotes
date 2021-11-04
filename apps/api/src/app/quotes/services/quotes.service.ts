import { Injectable } from "@nestjs/common";

import { join } from "path";

import { Quote } from "@quotes/api-interfaces";

import { getRandomFromArray } from "../../shared/utils";
import { ResultReturnOptions, JsonDbCollectionService, BaseRepo, RepoResult } from '../../json-db-collection';

export interface QuoteSearchCriteria {
  author?: string|string[];
  tags?: string[];
  isDeleted?: boolean;
  text?: string;
}

@Injectable()
export class QuotesService extends BaseRepo<Quote>{

  constructor(private quotesJson: JsonDbCollectionService<Quote>) {
    super();

    this.quotesJson
      .loadCollection(join(__dirname, 'assets', 'quotes.json')) // get from config..
      .then()
      .catch()
      .finally();
  }

  find(
    searchCriteria: QuoteSearchCriteria = {},
    { limit, page = 0, sortBy, order }: ResultReturnOptions = {},
  ): Promise<RepoResult<Quote | Quote[] | null>> {
    const { tags, author, isDeleted } = searchCriteria;

    return this.quotesJson.find({
      where: { tags, author, isDeleted },
      sortBy, order, limit, page,
    })
      .then(({ result, resultCount, total, limit, page }) => ({
        result, resultCount, page, limit, total,
      }))
      .catch((error) => ({ result: null, error }));
  }

  findOne(id: string): Promise<RepoResult<Quote | null>> {
    return this.quotesJson.findById(id)
      .then(({ result }) => ({ result }))
      .catch(error => ({ result: null, error }));
  }

  random({ author, tags, isDeleted }: QuoteSearchCriteria): Promise<RepoResult<Quote>> {
    return this.quotesJson.find({ where: { author, tags, isDeleted } })
      .then(({ result }) => (Array.isArray(result) ? result : [ result ]))
      .then((quotes: Quote[]) => ({
        result: getRandomFromArray<Quote>(quotes),
      })).catch(error => ({ result: null, error }));
  }

  update(id: string, data: Partial<Quote>): Promise<RepoResult<boolean>> {
    return this.quotesJson.update(id, data);
  }

  delete(id: string): Promise<RepoResult<boolean>> {
    return this.quotesJson.delete(id);
  }

}
