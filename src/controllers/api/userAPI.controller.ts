import { Body, Controller, Get, Post, Session } from "@nestjs/common";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { FulfillService } from "../../services/fulfill.service";
import { ScheduleService } from "../../services/schedule.service";

@Controller("api/user")
export class UserAPIController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly fulfillService: FulfillService,
    private readonly scheduleService: ScheduleService
  ) {
  }

  @Get("/getUsername")
  public async getUsername(
    @Session() session: Record<string, any>
  ) {
    return session.username;
  }

  @Get("/makeUserSync")
  public async makeUserSync(
    @Session() session: Record<string, any>
  ) {
    await this.fulfillService.makeUserSync(
      session.username,
      session.password
    );
    return true;
  }

  @Post("/isUser")
  public async isUser(
    @Body("username") username: string,
    @Body("password") password: string,
    @Session() session: Record<string, any>
  ) {
    const isUser = await this.userService.isUser(username, password);
    if (isUser) {
      session.username = username;
      session.password = password;
    }
    return { isUser };
  }

  @Get("/getUsers")
  public async getUsers(
    @Session() session: Record<string, any>
  ) {
    return session.username ? await this.userService.getUsers() : null;
  }


  @Get("/syncHisCode")
  public async syncHisCode(
    @Session() session: Record<string, any>
  ) {
    if (session.username) {
      await this.fulfillService.syncHisCode();
      return true;
    } else {
      return false;
    }
  }

  @Get("/getAllUserHisCode")
  public async getAllUserHisCode(
    @Session() session: Record<string, any>
  ) {
    if (session.username) {
      return this.userService.getAllUserHisCode();
    } else {
      return false;
    }
  }

  @Get("/fulfillSchedule")
  public async fulfillSchedule(
    @Session() session: Record<string, any>
  ) {
    if (session.username) {
      await this.fulfillService.fulfillSchedule();
    }
    return true;
  }

  @Get("/getIncompleteHisCode")
  public async getIncompleteHisCode(
    @Session() session: Record<string, any>
  ) {
    return this.userService.getIncompleteHisCode(session.username, session.password);
  }

  @Get("/getSchoolCalender")
  public async getSchoolCalender(
    @Session() session: Record<string, any>
  ) {
    return {
      schoolCalender: await this.userService.getCalender(session.username, session.password)
    };
  }

  @Get("/getSchedule")
  public async getSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getSchedule(
        session.username,
        session.password
      )
    };
  }
}
