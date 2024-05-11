/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { TimeTracker } from 'src/schemas/time-tracker.schema';
import { v4 as uuid4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';
import { PendingActionsDto } from './dto/pending-actions-dto';

@Injectable()
export class TimeTrackerService {

  constructor(
    @InjectModel(TimeTracker.name) private readonly TimeTrackerModel: Model<TimeTracker>,
    private readonly userService: UserService,
  ) { }
  async uploadBase64(base64Data: string): Promise<string> {

    try {
      const image = base64Data.replace(/^data:image\/\w+;base64,/, '');

      const fileName = uuid4() + '.png';
      const filePath = `public/uploads/${fileName}`;

      if (!existsSync('public')) {
        mkdirSync('public');
      }
      if (!existsSync('public/uploads')) {
        mkdirSync('public/uploads');
      }
      const writeStream = createWriteStream(filePath, { encoding: 'base64' });
      writeStream.write(image, 'base64');

      return fileName;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }

  // async Start(filePath: string, userID: string) {
  //   const today = moment.utc();
  //   const startDate = today.startOf('day').valueOf();
  //   const endDate = today.endOf('day').valueOf();

  //   const latestStopEvent = await this.TimeTrackerModel.findOne({
  //     userId: userID,
  //     type: 'stop',
  //     createdAt: { $gte: startDate, $lt: endDate }
  //   }).sort({ createdAt: -1 });

  //   const latestStartEvent = await this.TimeTrackerModel.findOne({
  //     userId: userID,
  //     type: 'start',
  //     createdAt: { $gte: startDate, $lt: endDate }
  //   }).sort({ createdAt: -1 });
  //   if (latestStartEvent && (!latestStopEvent || latestStartEvent.get('createdAt') > latestStopEvent.get('createdAt'))) {
  //     throw new BadRequestException('Timer already started');
  //   }

  //   const timeTracker = new this.TimeTrackerModel({
  //     date: moment.utc().valueOf(),
  //     userId: userID,
  //     type: 'start',
  //     image: filePath
  //   });
  //   return await timeTracker.save();
  // }

  async Start(filePath: string, userID: string) {
    const today = moment.utc();
    const startDate = today.startOf('day').valueOf();
    const endDate = today.endOf('day').valueOf();

    const latestStopEvent = await this.TimeTrackerModel.findOne({
      userId: userID,
      type: 'stop',
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    const latestStartEvent = await this.TimeTrackerModel.findOne({
      userId: userID,
      type: 'start',
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    if (latestStartEvent && (!latestStopEvent || latestStartEvent.get('date') > latestStopEvent.get('date'))) {
      throw new BadRequestException('Timer already started');
    }

    const timeTracker = new this.TimeTrackerModel({
      date: moment.utc().valueOf(),
      userId: userID,
      type: 'start',
      image: filePath
    });
    return await timeTracker.save();
  }

  async Stop(filePath: string, userID: string) {
    const today = moment.utc();
    const startDate = today.startOf('day').valueOf();
    const endDate = today.endOf('day').valueOf();

    const latestStartEvent = await this.TimeTrackerModel.findOne({
      userId: userID,
      type: 'start',
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    const latestStopEvent = await this.TimeTrackerModel.findOne({
      userId: userID,
      type: 'stop',
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    if (!latestStartEvent || (latestStopEvent && latestStopEvent.get('date') > latestStartEvent.get('date'))) {
      throw new BadRequestException('Timer already stopped');
    }

    const timeTracker = new this.TimeTrackerModel({
      date: moment.utc().valueOf(),
      userId: userID,
      type: 'stop',
      image: filePath,
    });
    return await timeTracker.save();
  }

  // async Stop(filePath: string, userID: string) {
  //   const today = moment.utc();
  //   const startDate = today.startOf('day').valueOf();
  //   const endDate = today.endOf('day').valueOf();

  //   const latestStartEvent = await this.TimeTrackerModel.findOne({
  //     userId: userID,
  //     type: 'start',
  //     createdAt: { $gte: startDate, $lt: endDate }
  //   }).sort({ createdAt: -1 });

  //   const latestStopEvent = await this.TimeTrackerModel.findOne({
  //     userId: userID,
  //     type: 'stop',
  //     createdAt: { $gte: startDate, $lt: endDate }
  //   }).sort({ createdAt: -1 });
  //   if (!latestStartEvent || (latestStopEvent && latestStopEvent.get('createdAt') > latestStartEvent.get('createdAt'))) {
  //     throw new BadRequestException('Timer already stopped');
  //   }

  //   const timeTracker = new this.TimeTrackerModel({
  //     date: moment.utc().valueOf(),
  //     userId: userID,
  //     type: 'stop',
  //     image: filePath,
  //   });
  //   return await timeTracker.save();
  // }

  async updateIsActive(userID: string) {
    const timeTracker = new this.TimeTrackerModel({
      userId: userID,
      type: 'isActive',
      date: moment.utc().valueOf(),
    });

    return await timeTracker.save();
  }
  async captureImage(filePath, userID) {
    const timeTracker = new this.TimeTrackerModel({
      date: moment.utc().valueOf(),
      userId: userID,
      type: 'captureImage',
      image: filePath
    });
    return await timeTracker.save();


  }




  // async getTimeTrackerData(userId: string, date: number) {
  //   const userID = new mongoose.Types.ObjectId(userId);
  //   const dateMoment = moment(Number(date));

  //   const startDate = dateMoment.startOf('day').toDate();
  //   const endDate = dateMoment.endOf('day').toDate();

  //   const data = await this.TimeTrackerModel.find({
  //     userId: userID,
  //     createdAt: {
  //       $gte: startDate,
  //       $lt: endDate
  //     }
  //   });

  //   const startStopPairs = [];
  //   let currentPair = null;

  //   for (const item of data) {
  //     if (item.type === 'start') {
  //       if (currentPair) {
  //         startStopPairs.push(currentPair);
  //         currentPair = null;
  //       }
  //       currentPair = { start: item, stop: null, captureImages: [] };
  //     } else if (item.type === 'stop') {
  //       if (currentPair) {
  //         currentPair.stop = item;
  //         startStopPairs.push(currentPair);
  //         currentPair = null;
  //       }
  //     } else if (item.type === 'captureImage' && currentPair) {
  //       currentPair.captureImages.push(item.image);

  //     }
  //   }
  //   if (currentPair) {
  //     startStopPairs.push(currentPair);
  //   }
  //   return startStopPairs.map(pair => ({

  //     startTime: pair.start.date,
  //     endTime: pair.stop ? pair.stop.date : moment.utc().valueOf(),
  //     images: pair.stop ? [pair.start.image, ...pair.captureImages, pair.stop.image] : [pair.start.image, ...pair.captureImages],
  //     totalTime: pair.stop ? moment.duration(moment(pair.stop.date).diff(moment(pair.start.date))) : moment.duration(moment(moment.utc().valueOf()).diff(moment(pair.start.date)))

  //   }));


  // }

  async getTimeTrackerData(userId: string, date: number) {
    const userID = new mongoose.Types.ObjectId(userId);
    const dateMoment = moment(Number(date));

    const startDate = dateMoment.startOf('day').valueOf();
    const endDate = dateMoment.endOf('day').valueOf();

    const data = await this.TimeTrackerModel.find({
      userId: userID,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    const startStopPairs = [];
    let currentPair = null;

    for (const item of data) {
      if (item.type === 'start') {
        if (currentPair) {
          startStopPairs.push(currentPair);
          currentPair = null;
        }
        currentPair = { start: item, stop: null, captureImages: [] };
      } else if (item.type === 'stop') {
        if (currentPair) {
          currentPair.stop = item;
          startStopPairs.push(currentPair);
          currentPair = null;
        }
      } else if (item.type === 'captureImage' && currentPair) {
        currentPair.captureImages.push(item.image);
      }
    }
    if (currentPair) {
      startStopPairs.push(currentPair);
    }

    return startStopPairs.map(pair => ({
      startTime: pair.start.date,
      endTime: pair.stop ? pair.stop.date : moment.utc().valueOf(),
      images: pair.stop ? [pair.start.image, ...pair.captureImages, pair.stop.image] : [pair.start.image, ...pair.captureImages],
      totalTime: pair.stop ? moment.duration(moment(pair.stop.date).diff(moment(pair.start.date))) : moment.duration(moment(moment.utc().valueOf()).diff(moment(pair.start.date)))
    }));
  }


  // async getTimeTrackerDataById(userId, date: number) {
  //   const userID = new mongoose.Types.ObjectId(userId);
  //   const dateMoment = moment(Number(date));

  //   const startDate = dateMoment.startOf('day').toDate();
  //   const endDate = dateMoment.endOf('day').toDate();
  //   const data = await this.TimeTrackerModel.find({
  //     userId: userID,
  //     createdAt: {
  //       $gte: startDate,
  //       $lt: endDate
  //     }
  //   });
  //   const startStopPairs = [];
  //   let currentPair = null;
  //   for (const item of data) {
  //     if (item.type === 'start') {
  //       if (currentPair) {
  //         startStopPairs.push(currentPair);
  //         currentPair = null;
  //       }
  //       currentPair = { start: item, stop: null, captureImages: [] };
  //     } else if (item.type === 'stop') {
  //       if (currentPair) {
  //         currentPair.stop = item;
  //         startStopPairs.push(currentPair);
  //         currentPair = null;
  //       }
  //     } else if (item.type === 'captureImage' && currentPair) {
  //       currentPair.captureImages.push(item.image);
  //     }
  //   }
  //   if (currentPair) {
  //     startStopPairs.push(currentPair);
  //   }
  //   return startStopPairs.map(pair => ({
  //     startTime: pair.start.date,
  //     endTime: pair.stop ? pair.stop.date : moment.utc().valueOf(),
  //     images: pair.stop ? [pair.start.image, ...pair.captureImages, pair.stop.image] : [pair.start.image, ...pair.captureImages],
  //     totalTime: pair.stop ? moment.duration(moment(pair.stop.date).diff(moment(pair.start.date))).asHours().toFixed(2) : moment.duration(moment(moment.utc().valueOf()).diff(moment(pair.start.date))).asHours().toFixed(2)

  //   }));
  // }

  async getTimeTrackerDataById(userId, date: number) {
    const userID = new mongoose.Types.ObjectId(userId);
    const dateMoment = moment(Number(date));

    const startDate = dateMoment.startOf('day').valueOf();
    const endDate = dateMoment.endOf('day').valueOf();

    const data = await this.TimeTrackerModel.find({
      userId: userID,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    const startStopPairs = [];
    let currentPair = null;

    for (const item of data) {
      if (item.type === 'start') {
        if (currentPair) {
          startStopPairs.push(currentPair);
          currentPair = null;
        }
        currentPair = { start: item, stop: null, captureImages: [] };
      } else if (item.type === 'stop') {
        if (currentPair) {
          currentPair.stop = item;
          startStopPairs.push(currentPair);
          currentPair = null;
        }
      } else if (item.type === 'captureImage' && currentPair) {
        currentPair.captureImages.push(item.image);
      }
    }
    if (currentPair) {
      startStopPairs.push(currentPair);
    }

    return startStopPairs.map(pair => ({
      startTime: pair.start.date,
      endTime: pair.stop ? pair.stop.date : moment.utc().valueOf(),
      images: pair.stop ? [pair.start.image, ...pair.captureImages, pair.stop.image] : [pair.start.image, ...pair.captureImages],
      totalTime: pair.stop ? moment.duration(moment(pair.stop.date).diff(moment(pair.start.date))).asHours().toFixed(2) : moment.duration(moment(moment.utc().valueOf()).diff(moment(pair.start.date))).asHours().toFixed(2)
    }));
  }

  async getTotalTime(userId, startDate: number, endDate?: number) {
    const userID = new mongoose.Types.ObjectId(userId);

    const startDateMoment = moment(Number(startDate));
    const start = startDateMoment.startOf('day').toDate();
    const endDateMoment = moment(Number(endDate))
    const end = endDate ? endDateMoment.endOf('day').toDate() : startDateMoment.endOf('day').toDate();

    const data = await this.TimeTrackerModel.find({
      userId: userID,
      date: {
        $gte: start,
        $lt: end
      }
    });

    const totalTimeByDate = {};
    let currentStart = 0;

    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      const currentDate = new Date(event.date).toISOString().split('T')[0];
      if (!totalTimeByDate[currentDate]) {
        totalTimeByDate[currentDate] = 0;

      }
      if (event.type === 'start') {
        currentStart = new Date(event.date).getTime();
      } else if (event.type === 'stop') {
        const currentStop = new Date(event.date).getTime();

        totalTimeByDate[currentDate] += currentStop - currentStart;
      }
    }

    for (const date in totalTimeByDate) {
      totalTimeByDate[date] = Math.round(totalTimeByDate[date]);
    }

    const formattedData = Object.keys(totalTimeByDate).map(date => ({
      date: moment.utc(date).valueOf(),
      totalTime: totalTimeByDate[date]
    }));



    return formattedData;
  }

  async getTotalTimeById(userId: string, startDate: number, endDate?: number) {
    const userID = new mongoose.Types.ObjectId(userId);

    const startDateMoment = moment(Number(startDate));
    const start = startDateMoment.startOf('day').toDate();
    const endDateMoment = moment(Number(endDate))
    const end = endDate ? endDateMoment.endOf('day').toDate() : startDateMoment.endOf('day').toDate();

    const data = await this.TimeTrackerModel.find({
      userId: userID,
      date: {
        $gte: start,
        $lt: end
      }
    });


    const totalTimeByDate = {};
    let currentStart = 0;

    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      const currentDate = new Date(event.date).toISOString().split('T')[0];
      if (!totalTimeByDate[currentDate]) {
        totalTimeByDate[currentDate] = 0;
      }
      if (event.type === 'start') {
        currentStart = new Date(event.date).getTime();
      } else if (event.type === 'stop') {
        const currentStop = new Date(event.date).getTime();
        totalTimeByDate[currentDate] += currentStop - currentStart;
      }
    }

    for (const date in totalTimeByDate) {
      totalTimeByDate[date] = Math.round(totalTimeByDate[date]);
    }

    const formattedData = Object.keys(totalTimeByDate).map(date => ({
      date: moment.utc(date).valueOf(),
      totalTime: totalTimeByDate[date]
    }));

    return formattedData;
  }


  async getLatestEvent(userId, date: number): Promise<any> {
    const userID = new mongoose.Types.ObjectId(userId)
    const dateMoment = moment(Number(date));

    const startDate = dateMoment.startOf('day').toDate();
    const endDate = dateMoment.endOf('day').toDate();

    const latestEvent = await this.TimeTrackerModel.find({
      userId: userID,
      date: {
        $gte: startDate,
        $lt: endDate
      },
      type: { $in: ['start', 'stop'] }
    }).sort({ date: -1 }).limit(1);

    return latestEvent

  }




  @Cron('*/15 * * * *')
  async handleCron() {
    await this.getEventsForUsers();
    console.log("run cron")
  }


  async getEventsForUsers() {
    const users = await this.userService.findAllUsers();

    const today = moment.utc();
    const startDate = today.startOf('day').valueOf();
    const endDate = today.endOf('day').valueOf();

    for (const user of users) {
      const userID = new mongoose.Types.ObjectId(user.id);

      const [lastStartEvent, lastStopEvent] = await Promise.all([
        this.TimeTrackerModel.findOne({
          userId: userID,
          type: 'start',
          date: { $gte: startDate, $lt: endDate }
        }).sort({ date: -1 }),

        this.TimeTrackerModel.findOne({
          userId: userID,
          type: 'stop',
          date: { $gte: startDate, $lt: endDate }
        }).sort({ date: -1 })
      ]);

      if (lastStartEvent && (!lastStopEvent || lastStartEvent.get('date') > lastStopEvent.get('date'))) {
        const lastIsActiveEvent = await this.TimeTrackerModel.findOne({
          userId: userID,
          type: 'isActive',
          date: { $gt: lastStartEvent.get('date') }
        }).sort({ date: -1 });

        if (lastIsActiveEvent) {
          const fifteenMinutesAgo = moment().clone().subtract(15, 'minutes');

          if (lastIsActiveEvent.get('date') <= fifteenMinutesAgo.valueOf()) {
            const timeTracker = new this.TimeTrackerModel({
              date: moment.utc().valueOf(),
              userId: userID,
              type: 'stop'
            });
            console.log("stop")
            return await timeTracker.save();
          }
        }
      }
    }
  }

  async pendingActionService(userId, actions: PendingActionsDto): Promise<any> {
    const userID = new mongoose.Types.ObjectId(userId)
    const dateMoment = moment.utc();
    const startDate = dateMoment.startOf('day').toDate();
    const endDate = dateMoment.endOf('day').toDate();

    const latestEvent = await this.TimeTrackerModel.findOne({
      userId: userID,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ date: -1 });

    if (latestEvent && latestEvent.type === 'start') {
      for (const action of actions.actions) {
        await this.TimeTrackerModel.create({
          userId: userID,
          date: action.date,
          type: action.type,
          image: action.image
        });
      }
    } else if (latestEvent && latestEvent.type === 'stop') {
      const stopEventDate = latestEvent.date;

      const filteredActions = actions.actions.filter(
        action => (action.type === 'start' || action.type === 'stop') && action.date < stopEventDate
      );

      if (filteredActions.length > 0) {
        const newEvents = [];

        const closestEvent = filteredActions.reduce((prev, curr) =>
          Math.abs(curr.date - stopEventDate) < Math.abs(prev.date - stopEventDate) ? curr : prev
        );

        if (closestEvent.type === "start") {
          const startEventDate = moment(stopEventDate).add(1, 'second').toDate();
          await this.TimeTrackerModel.create({
            userId: userID,
            date: startEventDate,
            type: 'start'
          });

          for (const action of actions.actions) {
            const newEvent = await this.TimeTrackerModel.create({
              userId: userID,
              date: action.date,
              type: action.type,
              image: action.image
            });
            newEvents.push(newEvent);
          }
        } else if (closestEvent.type === "stop") {
          const startEventDate = moment(stopEventDate).subtract(1, 'second').toDate();
          await this.TimeTrackerModel.create({
            userId: userID,
            date: startEventDate,
            type: 'start'
          });

          for (const action of actions.actions) {
            const newEvent = await this.TimeTrackerModel.create({
              userId: userID,
              date: action.date,
              type: action.type,
              image: action.image
            });
            newEvents.push(newEvent);
          }
        }

        return { newEvents };
      }
    }
  }

}
