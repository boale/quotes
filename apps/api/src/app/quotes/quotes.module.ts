import { Logger, Module } from '@nestjs/common';

import { JsonDbCollectionService, QuotesService } from "./services";
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
