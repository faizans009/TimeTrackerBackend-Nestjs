/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { IsEmailUserAlreadyExistConstraint } from '../helpers/validators/unique-email.decorator';

@Module({
  imports: [

    SharedModule,
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, IsEmailUserAlreadyExistConstraint],
  exports: [AuthService]
})
export class AuthModule { }
