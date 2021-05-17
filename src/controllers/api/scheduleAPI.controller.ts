import { Controller, Get, Query, Session } from '@nestjs/common';
import { ScheduleService } from '../../services/schedule.service';

@Controller('api/schedule')
export class ScheduleAPIController {

  constructor(private readonly scheduleService: ScheduleService) {
  }

  @Get('/getByCourseId')
  public getByCourseId(
    @Query('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    return this.scheduleService.getByCourseId(id, session.username, session.password);
  }

  @Get('/getByCourseIdExceptComplete')
  public getByCourseIdExceptComplete(
    @Query('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    return this.scheduleService.getByCourseIdExceptComplete(id, session.username, session.password);
  }

  @Get('/getHisCode')
  public getHisCode(
    @Query('id') id: number,
    @Query('seq') seq: number,
    @Query('kjKey') kjKey: string,
    @Query('ud') ud: number,
    @Session() session: Record<string, any>,
  ) {
    return this.scheduleService.getHisCode(id, seq, kjKey, ud, session.username, session.password);
  }

  // @Get('/fulfillSchedule')
  // public fulfillSchedule(
  //   @Query('id') id: number,
  //   @Query('seq') seq: number,
  //   @Query('kjKey') kjKey: string,
  //   @Query('ud') ud: number,
  // ) {
  //   return this.scheduleService.fulfillSchedule(id, seq, kjKey, ud);
  // }
}
