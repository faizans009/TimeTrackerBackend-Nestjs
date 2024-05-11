/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { SharedModule } from '../shared/shared.module';
import { IsEmailUserAlreadyExistConstraint } from '../helpers/validators/unique-email.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => SharedModule),
  ],
  controllers: [UserController],
  providers: [UserService, IsEmailUserAlreadyExistConstraint],
  exports: [UserService],
})
export class UserModule { }
