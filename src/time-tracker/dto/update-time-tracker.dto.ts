import { PartialType } from '@nestjs/swagger';
import { CreateTimeTrackerDto } from './create-time-tracker.dto';

export class UpdateTimeTrackerDto extends PartialType(CreateTimeTrackerDto) {}
