/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query, Request, UseGuards, UseInterceptors, } from '@nestjs/common';
import { TimeTrackerService } from './time-tracker.service';
import { CreateTimeTrackerDto } from './dto/create-time-tracker.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { IsAdmin } from 'src/helpers/decorators/is-admin.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from 'src/guards/user.guard';
import { IsUser } from 'src/helpers/decorators/user.decorator';
import { PendingActionsDto } from './dto/pending-actions-dto';


@Controller('time-tracker')
export class TimeTrackerController {
  constructor(private readonly timeTrackerService: TimeTrackerService) { }

  @Post('start')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async Start(@Body() body: CreateTimeTrackerDto, @Request() req: any) {
    const image = body.image;
    const filePath = await this.timeTrackerService.uploadBase64(image);
    const screenshot = await this.timeTrackerService.Start(
      filePath,
      req.user._id

    );
    return screenshot;
  }


  @Post('stop')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async Stop(@Body() body: CreateTimeTrackerDto, @Request() req: any) {
    const image = body.image;
    const filePath = await this.timeTrackerService.uploadBase64(image);
    const screenshot = await this.timeTrackerService.Stop(
      filePath,
      req.user._id
    );
    return screenshot;
  }

  @Post('is-active')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async updateIsActive(@Request() req) {
    return await this.timeTrackerService.updateIsActive(req.user._id);
  }

  @Post('captureImage')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async captureImage(@Body() body: CreateTimeTrackerDto, @Request() req: any) {
    const image = body.image;
    const filePath = await this.timeTrackerService.uploadBase64(image);
    const screenshot = await this.timeTrackerService.captureImage(
      filePath,
      req.user._id,

    );
    return screenshot;
  }


  @Get('recordsById')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @IsAdmin('admin')
  @ApiBearerAuth()
  async getTimeTrackerData(@Query('userId') userId: string, @Query('date') date: number) {
    return this.timeTrackerService.getTimeTrackerData(userId, date);
  }
  @Get('userRecords')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async getTimeTrackerDataById(@Request() req: any, @Query('date') date: number) {
    return this.timeTrackerService.getTimeTrackerDataById(req.user._id, date);
  }



  @Get('getTotalTimeById')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @IsAdmin('admin')
  @ApiBearerAuth()
  async getTotalTimeById(@Query('userId') userId: string, @Query('startDate') startDate: number, @Query('endDate') endDate: number) {
    return this.timeTrackerService.getTotalTime(userId, startDate, endDate);
  }
  @Get('getTotalTime')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @IsUser()
  @ApiBearerAuth()
  async getTotalTime(@Request() req: any, @Query('startDate') startDate: number, @Query('endDate') endDate: number) {
    return this.timeTrackerService.getTotalTime(req.user._id, startDate, endDate);
  }

  @Get('current-status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getEvents(@Request() req, @Query('date') date: number): Promise<any[]> {
    return this.timeTrackerService.getLatestEvent(req.user._id, date);
  }
  @Get('getAllEvents')
  async getAllEvents() {
    return this.timeTrackerService.getEventsForUsers();
  }

  @Post('pending-actions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async pendingActions(@Request() req, @Body() actions: PendingActionsDto): Promise<any[]> {
    return this.timeTrackerService.pendingActionService(req.user._id, actions);
  }

}
