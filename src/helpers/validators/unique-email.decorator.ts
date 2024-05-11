/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { UserService } from '../../user/user.service';


@ValidatorConstraint({ name: 'isEmailUserAlreadyExist', async: true })
@Injectable()
export class IsEmailUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(protected readonly userService: UserService) { }

    async validate(text: string) {
        const user = await this.userService.findOneByField({ email: text });
        return !user;

    }

}


export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUserAlreadyExistConstraint,
        });
    };
}

