/* eslint-disable prettier/prettier */
import { ObjectId } from 'mongodb';

export interface JwtPayload {
    id: ObjectId;
    email: string;
}
