/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
@Schema({
    timestamps: true,
    collection: "TimeTracker"
})


export class TimeTracker extends Document {
    @Prop()
    date: number;

    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({
        type: String,
        enum: ['start', 'pause', 'resume', 'stop', 'captureImage', 'isActive']
    })
    type: string;

    @Prop()
    image: string;

    @Prop({ type: Date })
    isActive: Date;


}


const schema = SchemaFactory.createForClass(TimeTracker)
export const TimeTrackerSchema = schema

export type TimeTrackerDocument = TimeTracker & Document;