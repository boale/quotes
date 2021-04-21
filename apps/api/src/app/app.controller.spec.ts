import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  beforeEach(async () => {
    appController = app.get<AppController>(AppController);
  });

  describe('health-check', () => {
    it('should return health-check object', () => {
      expect(appController.ping()).toEqual({ statusCode: 200, message: 'OK' });
    });
  });
});
