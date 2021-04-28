import {Controller, Get, Delete, Post, Put, Query, HttpStatus, Res, Param, Body} from '@nestjs/common';
import { Response } from 'express';

import { ApiResponseData, Quote } from "@quotes/api-interfaces";

import { QuotesService } from "./services";
import { RepoResult } from '../json-db-collection';
import { convertQueryDataToArray, mapToApiResponseData } from '../shared/utils';

@Controller('api/quotes')
export class QuotesController {

  constructor(private quotesService: QuotesService) {
  }

  @Get()
  findAll(
    @Query() query,
  ): Promise<ApiResponseData<Quote|Quote[]>> {
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
      .then(({ result, error }: RepoResult<Quote>) => {
        return error
          ? mapToApiResponseData<null, Error>(result as null, 500, 'Oops..', error)
          : mapToApiResponseData<Quote|Quote[]>(result)
      });
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
      .then(({ result, error }: RepoResult<Quote>) => {
        if (!result && ! error) {
          res.status(HttpStatus.NOT_FOUND)

          return mapToApiResponseData(result, HttpStatus.NOT_FOUND, 'Not found')
        }

        return error
          ? mapToApiResponseData<null, Error>(result as null, 500, 'Oops..', error)
          : mapToApiResponseData<Quote>(result as Quote)
      });
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.quotesService
      .findOne(id)
      .then(({ result }) => {
        if (!result) {
          res.status(HttpStatus.NOT_FOUND)

          return mapToApiResponseData(result, HttpStatus.NOT_FOUND, 'Not found')
        }

        return mapToApiResponseData(result);
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
      .then(({ result }) => mapToApiResponseData(result));
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
