import { Logger, Module } from '@nestjs/common';

import { QuotesService } from "./services";
import { JsonDbCollectionService } from "../json-db-collection";
import { QuotesController } from './quotes.controller';

@Module({
  controllers: [ QuotesController ],
  providers: [
    JsonDbCollectionService,
    QuotesService,
    Logger,
  ]
})
export class QuotesModule {}
