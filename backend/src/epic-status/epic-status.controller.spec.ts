import { Test, TestingModule } from '@nestjs/testing';
import { EpicStatusController } from './epic-status.controller';

describe('EpicStatusController', () => {
  let controller: EpicStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpicStatusController],
    }).compile();

    controller = module.get<EpicStatusController>(EpicStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
