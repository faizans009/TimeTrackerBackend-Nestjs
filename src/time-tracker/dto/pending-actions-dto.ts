/* eslint-disable prettier/prettier */
// create a file named pending-actions.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
    // @ApiProperty()
    // _id: string;

    @ApiProperty()
    date: number;

    // @ApiProperty()
    // userId: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    image?: string;

    // @ApiProperty()
    // createdAt: string;

    // @ApiProperty()
    // updatedAt: string;

    // @ApiProperty()
    // __v: number;
}

export class PendingActionsDto {
    @ApiProperty({ type: [EventDto] })
    actions: EventDto[];
}
