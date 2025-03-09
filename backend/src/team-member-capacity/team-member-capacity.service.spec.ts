import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberCapacityService } from './team-member-capacity.service';

describe('TeamMemberCapacityService', () => {
  let service: TeamMemberCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamMemberCapacityService],
    }).compile();

    service = module.get<TeamMemberCapacityService>(TeamMemberCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
