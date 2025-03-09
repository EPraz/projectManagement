import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberCapacityController } from './team-member-capacity.controller';

describe('TeamMemberCapacityController', () => {
  let controller: TeamMemberCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMemberCapacityController],
    }).compile();

    controller = module.get<TeamMemberCapacityController>(TeamMemberCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
