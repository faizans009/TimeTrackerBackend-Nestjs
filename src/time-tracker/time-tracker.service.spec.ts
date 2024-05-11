import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackerService } from './time-tracker.service';

describe('TimeTrackerService', () => {
  let service: TimeTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTrackerService],
    }).compile();

    service = module.get<TimeTrackerService>(TimeTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
