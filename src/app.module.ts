/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { TimeTrackerModule } from './time-tracker/time-tracker.module';
import 'dotenv/config';
@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://mfaizannoor11:BvDkkB5KnHPU2kRp@timedoctor.bdzsr0h.mongodb.net/'),
    MongooseModule.forRoot(process.env.MONGO_URI),

    AuthModule,
    UserModule,
    SharedModule,
    TimeTrackerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
