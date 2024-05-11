/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({
    timestamps: true,
    collection: "users"
})
export class User extends Document {

    @Prop({ required: true })
    name: string;

    @Prop()
    image: string;

    @Prop({ required: true, trim: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;
    @Prop({ required: true })
    stack: string;
    @Prop({ required: true })
    screenshotTime: number;

    @Prop({ required: true, default: "user", enum: ["user", "admin"] })
    role: string;

    @Prop()
    otp: string;

    @Prop({ default: false })
    isEmailVerified: boolean;


}
const schema = SchemaFactory.createForClass(User)
export const UserSchema = schema