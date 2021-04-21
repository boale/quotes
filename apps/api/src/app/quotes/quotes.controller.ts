import {Controller, Get, Delete, Post, Put, Query, HttpStatus, Res, Param, Body} from '@nestjs/common';
import { Response } from 'express';

import { QuotesService } from "./services";
import { ApiResponseData, Quote } from "@quotes/api-interfaces";

function mapToApiResponseData<T, E = null>(data: T, statusCode = 200, message = 'OK', error?: E): ApiResponseData<T, E> {
  return {  data,  message, statusCode, error };
}

function convertQueryDataToArray<T = unknown>(queryData: unknown, sep = ','): T[] | string[] | unknown[] {
  if (Array.isArray(queryData)) {
    return queryData.reduce((memo, data) => ([ ...memo, ...convertQueryDataToArray<T>(data)]), []);
  }

  if(typeof queryData === 'string') {
    return queryData.split(sep);
  }

  return [ queryData ];
}

@Controller('api/quotes')
export class QuotesController {

  constructor(private quotesService: QuotesService) {
  }

  @Get()
  findAll(
    @Query() query,
  ): Promise<ApiResponseData<Quote[]>> {
    // TODO: DRY
    const { tags, tag, page, limit, author, order, sortBy } = query;
    const normalizedTags = [
      ...convertQueryDataToArray<string>(tags),
      ...convertQueryDataToArray<string>(tag),
    ].filter(t => Boolean(t)) as string[];

    return this.quotesService
      .find({
        isDeleted: false, // TODO: expose all for authorized users...
        tags: normalizedTags,
        author: convertQueryDataToArray<string>(author) as string[],
      }, {
        page,
        limit,
        order,
        sortBy,
      })
      .then((data: Quote[]) => mapToApiResponseData<Quote[]>(data));
  }

  @Post()
  create() {
    return { created: true };
  }

  @Get('random')
  random(
    @Query() query,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tags, tag, author } = query

    // TODO: DRY...
    const normalizedTags = [
      ...convertQueryDataToArray<string>(tags),
      ...convertQueryDataToArray<string>(tag),
    ].filter(t => Boolean(t)) as string[];

    return this.quotesService
      .random({
        isDeleted: false,
        tags: normalizedTags,
        author: convertQueryDataToArray<string>(author) as string[],
      })
      .then((data: Quote) => {
        if (!data) {
          res.status(HttpStatus.NOT_FOUND)

          return mapToApiResponseData(data, HttpStatus.NOT_FOUND, 'Not found')
        }

        return mapToApiResponseData(data);
      });
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.quotesService
      .findOne(id)
      .then((quote) => {
        if (!quote) {
          res.status(HttpStatus.NOT_FOUND)

          return mapToApiResponseData(quote, HttpStatus.NOT_FOUND, 'Not found')
        }

        return mapToApiResponseData(quote);
      });
  }

  @Put(':id')
  updateById(
    @Param('id') id: string,
    @Body() body,
  ) {
    // TODO: check 404...
    return this.quotesService
      .update(id, body)
      .then(() => this.quotesService.findOne(id))
      .then((quote) => mapToApiResponseData(quote));
  }

  @Delete(':id')
  deleteById(
    @Param('id') id: string,
  ) {
    return this.quotesService
      .delete(id)
      .then(() => mapToApiResponseData(null));
  }
}
