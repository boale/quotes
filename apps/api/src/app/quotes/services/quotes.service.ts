import { Injectable } from "@nestjs/common";

import { join } from "path";

import { Quote } from "@quotes/api-interfaces";

import { getRandomFromArray } from "../../shared/utils";
import { ResultReturnOptions, JsonDbCollectionService } from "./json-db-collection";

export interface QuoteSearchCriteria {
  author?: string|string[];
  tags?: string[];
  isDeleted?: boolean;
  text?: string;
}

@Injectable()
export class QuotesService {

  constructor(private quotesJson: JsonDbCollectionService<Quote>) {
    this.quotesJson
      .loadCollection(join(__dirname, 'assets', 'quotes.json'))
      .then()
      .catch()
      .finally();
  }

  find(
    searchCriteria: QuoteSearchCriteria = {},
    { limit, page = 0, sortBy, order }: ResultReturnOptions = {},
  ): Promise<Quote | Quote[] | null> {
    const { tags, author, isDeleted } = searchCriteria;

    return this.quotesJson.find({ where: { tags, author, isDeleted }, sortBy, order, limit, page })
      .then(({ result }) => result)
      .catch(() => ([]));
  }

  findOne(id: string): Promise<Quote | null> {
    return this.quotesJson.findById(id)
      .then(({ result }) => result as Quote);
  }

  random({ author, tags, isDeleted }: QuoteSearchCriteria): Promise<Quote> {
    return this.quotesJson.find({ where: { author, tags, isDeleted } })
      .then(({ result }) => (Array.isArray(result) ? result : [ result ]))
      .then((quotes: Quote[]) => getRandomFromArray<Quote>(quotes));
  }

  update(id: string, data: Partial<Quote>): Promise<unknown> {
    return this.quotesJson.update(id, data);
  }

  delete(id: string): Promise<unknown> {
    return this.quotesJson.delete(id);
  }

}
