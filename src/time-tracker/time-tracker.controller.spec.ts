import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackerController } from './time-tracker.controller';
import { TimeTrackerService } from './time-tracker.service';

describe('TimeTrackerController', () => {
  let controller: TimeTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTrackerController],
      providers: [TimeTrackerService],
    }).compile();

    controller = module.get<TimeTrackerController>(TimeTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
