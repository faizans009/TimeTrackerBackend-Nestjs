/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UserService {
  constructor(
    private sharedService: SharedService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async findByField(condition) {
    const user = await this.userModel.find(condition);
    return user
  }
  async findById(condition) {
    const user = await this.userModel.findById(condition);
    return user
  }

  async findAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async findOneByField(condition: any) {
    const user = await this.userModel.findOne(condition);
    return user
  }

  async create(body: any): Promise<User> {
    const newBody = body.registerUser;
    const password = await this.sharedService.encodePassword(newBody.password)

    return await this.userModel.create({
      ...newBody,
      password: password,
    });
  }


}
