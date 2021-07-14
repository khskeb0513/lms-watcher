import { Controller, Get, Render, Session } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get("/getIncompleteSchedule")
  @Render("user/getIncompleteSchedule")
  public async getIncompleteSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getIncompleteSchedule(session.cookieStr)
    };
  }

  @Get("/getSchedule")
  @Render("user/getIncompleteSchedule")
  public async getSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getSchedule(session.cookieStr)
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
