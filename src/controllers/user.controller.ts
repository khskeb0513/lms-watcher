import { Controller, Get, Render } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Get('/getIncompleteSchedule')
  @Render('getIncompleteSchedule.hbs')
  public async getIncompleteSchedule() {
    return { courses: await this.userService.getIncompleteSchedule() };
  }

  @Get('/getIncompleteReport')
  @Render('getIncompleteReport')
  public async getIncompleteReport() {
    return { courses: await this.userService.getIncompleteReport() };
  }

  @Get('/setBrowserLoginSession')
  @Render('setBrowserLoginSession')
  public async setBrowserLoginSession() {
    return;
  }

  @Get('/getCalender')
  @Render('getCalender')
  public async getCalender() {
    return { calenders: await this.userService.getCalender() }
  }

  @Get('/getReportCalender')
  @Render('getReportCalender')
  public async getReportCalender() {
    return { calenders: await this.userService.getReportCalender() }
  }
}
