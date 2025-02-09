import { Test, TestingModule } from '@nestjs/testing';
import { EpicStatusService } from './epic-status.service';

describe('EpicStatusService', () => {
  let service: EpicStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpicStatusService],
    }).compile();

    service = module.get<EpicStatusService>(EpicStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
