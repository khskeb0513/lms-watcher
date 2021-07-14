import { Body, Controller, Get, Post, Session } from "@nestjs/common";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { ScheduleService } from "../../services/schedule.service";
import isUserResponseDto from "../../domain/dto/isUserResponseDto";

@Controller("api/user")
export class UserAPIController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService
  ) {
  }

  @Get("/getUsername")
  public async getUsername(
    @Session() session: Record<string, any>
  ) {
    return session.username;
  }

  @Post("/isUser")
  public async isUser(
    @Body("username") username: string,
    @Body("password") password: string,
    @Session() session: Record<string, any>
  ): Promise<isUserResponseDto> {
    const isUser = await this.sessionService.isUser(username, password);
    if (isUser.isUser) {
      session.username = username;
      session.password = password;
      session.cookieStr = isUser.cookie;
    }
    return { isUser: isUser.isUser };
  }

  @Get("/isSessionAvailable")
  public async isSessionAvailable(
    @Session() session: Record<string, any>
  ) {
    const isSessionAvailable = await this.sessionService.isSessionAvailable(session.cookieStr);
    return { isSessionAvailable };
  }

  @Get("/getSessionValue")
  public async getSessionValue(
    @Session() session: Record<string, any>
  ) {
    const cookie = session.cookieStr;
    const status = await this.sessionService.isSessionAvailable(cookie);
    return { cookie, status };
  }

  @Post("/setSessionValue")
  public async setSessionValue(
    @Body("cookieStr") cookieStr: string,
    @Session() session: Record<string, any>
  ) {
    if (await this.sessionService.isSessionAvailable(cookieStr)) {
      session.cookieStr = cookieStr;
      session.username = await this.userService.getUsername(cookieStr);
      return {
        cookie: cookieStr,
        set: true
      };
    } else {
      return {
        set: false
      };
    }
  }
  @Get("/getSchoolCalender")
  public async getSchoolCalender(
    @Session() session: Record<string, any>
  ) {
    return {
      schoolCalender: await this.userService.getCalender(session.cookieStr)
    };
  }

  @Get("/getSchedule")
  public async getSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getSchedule(session.cookieStr)
    };
  }
}
