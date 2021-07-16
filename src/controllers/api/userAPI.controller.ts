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

  @Get("/isSessionValid")
  public async isSessionValid(
    @Session() session: Record<string, any>
  ) {
    const isSessionAvailable = await this.sessionService.isSessionValid(session.cookieStr);
    return { isSessionAvailable };
  }

  @Get("/getSessionValue")
  public async getSessionValue(
    @Session() session: Record<string, any>
  ) {
    const cookie = session.cookieStr;
    const status = await this.sessionService.isSessionValid(cookie);
    return { cookie, status };
  }

  @Get("/renewSession")
  public async renewSession(
    @Session() session: Record<string, any>
  ) {
    const newCookie = await this.sessionService.isUser(
      session.username, session.password
    );
    if (newCookie.isUser) {
      session.cookieStr = newCookie.cookie;
      return {
        set: true
      };
    } else {
      return {
        set: false
      };
    }
  }

  @Post("/setSessionValue")
  public async setSessionValue(
    @Body("cookieStr") cookieStr: string,
    @Session() session: Record<string, any>
  ) {
    if (await this.sessionService.isSessionValid(cookieStr)) {
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
