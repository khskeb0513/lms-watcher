import { Controller, Get, Query, Session } from "@nestjs/common";
import { ScheduleService } from "../../services/schedule.service";
import { FulfillService } from "../../services/fulfill.service";

@Controller("api/schedule")
export class ScheduleAPIController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly fulfillService: FulfillService
  ) {
  }

  @Get("/getByCourseId")
  public getByCourseId(
    @Query("id") id: string,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.getByCourseId(
      id,
      session.cookieStr
    );
  }

  @Get("/getByCourseIdExceptComplete")
  public getByCourseIdExceptComplete(
    @Query("id") id: string,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.getByCourseIdExceptComplete(
      id,
      session.cookieStr
    );
  }

  @Get("/getHisCode")
  public getHisCode(
    @Query("id") id: number,
    @Query("seq") seq: number,
    @Query("kjKey") kjKey: string,
    @Query("ud") ud: number,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.getHisCode(
      id,
      seq,
      kjKey,
      ud,
      session.cookieStr
    );
  }
}
