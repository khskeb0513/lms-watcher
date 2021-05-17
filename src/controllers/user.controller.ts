import { Controller, Get, Render, Session } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Get('/')
  @Render('user/index')
  public async root() {
    return;
  }

  @Get('/getIncompleteSchedule')
  @Render('user/getIncompleteSchedule')
  public async getIncompleteSchedule(
    @Session() session: Record<string, any>,
  ) {
    return { courses: await this.userService.getIncompleteSchedule(session.username, session.password) };
  }

  @Get('/getIncompleteReport')
  @Render('user/getIncompleteReport')
  public async getIncompleteReport(
    @Session() session: Record<string, any>,
  ) {
    return { courses: await this.userService.getIncompleteReport(session.username, session.password) };
  }

  @Get('/setBrowserLoginSession')
  @Render('user/setBrowserLoginSession')
  public async setBrowserLoginSession() {
    return;
  }

  @Get('/getCalender')
  @Render('user/getCalender')
  public async getCalender(
    @Session() session: Record<string, any>,
  ) {
    return { calenders: await this.userService.getCalender(session.username, session.password) };
  }

  @Get('/getReportCalender')
  @Render('user/getReportCalender')
  public async getReportCalender(
    @Session() session: Record<string, any>,
  ) {
    return { calenders: await this.userService.getReportCalender(session.username, session.password) };
  }
}
