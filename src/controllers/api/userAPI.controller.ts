import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Controller('api/user')
export class UserAPIController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {
  }

  @Get('/getUserInformation')
  public async getUserInformation() {
    return this.sessionService.getUserInformation();
  }

  @Post('/checkUserInformation')
  public async checkUserInformation(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.setBrowserLoginSession(username, password)
  }
}
