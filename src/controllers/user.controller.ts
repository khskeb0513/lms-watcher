import { Controller, Get, Query, Render, Session } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get("/requestHisStatus")
  @Render("user/requestHisStatus")
  public async requestHisStatus(
    @Query("item") item: number,
    @Query("seq") seq: number,
    @Query("kjKey") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    return this.userService.requestHisStatus(item, seq, kjKey, session.cookieStr);
  }

  @Get("/getIncompleteSchedule")
  @Render("user/getIncompleteSchedule")
  public async getIncompleteSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getIncompleteSchedule(session.cookieStr)
    };
  }

  @Get("/getSchedule")
  @Render("user/getSchedule")
  public async getSchedule(
    @Query("year") year: number,
    @Query("term") term: number,
    @Session() session: Record<string, any>
  ) {
    return {
      courses: !!year && !!term ? await this.userService.getSchedule(session.cookieStr, year, term) : await this.userService.getSchedule(session.cookieStr)
    };
  }

  @Get("/getIncompleteReport")
  @Render("user/getIncompleteReport")
  public async getIncompleteReport(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getIncompleteReport(session.cookieStr)
    };
  }

  @Get("/setBrowserLoginSession")
  @Render("user/setBrowserLoginSession")
  public async setBrowserLoginSession() {
    return;
  }

  @Get("/getCalender")
  @Render("user/getCalender")
  public async getCalender(@Session() session: Record<string, any>) {
    return {
      calenders: await this.userService.getCalender(session.cookieStr)
    };
  }

  @Get("/getReportCalender")
  @Render("user/getReportCalender")
  public async getReportCalender(@Session() session: Record<string, any>) {
    return {
      calenders: await this.userService.getReportCalender(session.cookieStr)
    };
  }
}
