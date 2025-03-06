import { Test, TestingModule } from '@nestjs/testing';
import { SprintGoalService } from './sprint-goal.service';

describe('SprintGoalService', () => {
  let service: SprintGoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SprintGoalService],
    }).compile();

    service = module.get<SprintGoalService>(SprintGoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
