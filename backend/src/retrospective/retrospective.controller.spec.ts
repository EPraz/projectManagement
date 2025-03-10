import { Test, TestingModule } from '@nestjs/testing';
import { RetrospectiveController } from './retrospective.controller';

describe('RetrospectiveController', () => {
  let controller: RetrospectiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetrospectiveController],
    }).compile();

    controller = module.get<RetrospectiveController>(RetrospectiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
