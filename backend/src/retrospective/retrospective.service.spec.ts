import { Test, TestingModule } from '@nestjs/testing';
import { RetrospectiveService } from './retrospective.service';

describe('RetrospectiveService', () => {
  let service: RetrospectiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetrospectiveService],
    }).compile();

    service = module.get<RetrospectiveService>(RetrospectiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
