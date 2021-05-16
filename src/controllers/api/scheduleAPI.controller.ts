import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from '../../services/schedule.service';

@Controller('api/schedule')
export class ScheduleAPIController {

  constructor(private readonly scheduleService: ScheduleService) {
  }

  @Get('/getByCourseId')
  public getByCourseId(@Query('id') id: string) {
    return this.scheduleService.getByCourseId(id);
  }

  @Get('/getByCourseIdExceptComplete')
  public getByCourseIdExceptComplete(@Query('id') id: string) {
    return this.scheduleService.getByCourseIdExceptComplete(id);
  }

  @Get('/getHisCode')
  public getHisCode(
    @Query('id') id: number,
    @Query('seq') seq: number,
    @Query('kjKey') kjKey: string,
    @Query('ud') ud: number,
  ) {
    return this.scheduleService.getHisCode(id, seq, kjKey, ud);
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
