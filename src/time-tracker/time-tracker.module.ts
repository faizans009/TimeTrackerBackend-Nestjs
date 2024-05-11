/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TimeTrackerService } from './time-tracker.service';
import { TimeTrackerController } from './time-tracker.controller';
import { TimeTracker, TimeTrackerSchema } from 'src/schemas/time-tracker.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [TimeTrackerController],
  imports: [
    MongooseModule.forFeature([{ name: TimeTracker.name, schema: TimeTrackerSchema }]),
    forwardRef(() => UserModule),
    ScheduleModule.forRoot()
  ],
  providers: [TimeTrackerService],

})
export class TimeTrackerModule { }
