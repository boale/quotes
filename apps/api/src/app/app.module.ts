import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { isDev } from "./shared/utils";
import { QuotesModule } from "./quotes/quotes.module";
import { AppController } from './app.controller';

@Module({
  imports: [
    QuotesModule,
    // TODO: remove once it split into separate apps in further tasks...
    ...(
      !isDev() ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, 'assets', 'client'),
          exclude: ['/api*', '/ping', '/health'],
        }) ,
      ] : []
    ),
  ],
  controllers: [ AppController ],
})
export class AppModule {}
