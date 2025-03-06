import { Test, TestingModule } from '@nestjs/testing';
import { SprintGoalController } from './sprint-goal.controller';

describe('SprintGoalController', () => {
  let controller: SprintGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprintGoalController],
    }).compile();

    controller = module.get<SprintGoalController>(SprintGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
