import { Controller, Get, Session } from '@nestjs/common';
import { CalenderService } from '../../services/calender.service';

@Controller('api/calender')
export class CalenderAPIController {
  constructor(
    private readonly calenderService: CalenderService
  ) {
  }

  @Get('/getCalender')
  public async getCalender(
    @Session() session: Record<string, any>
  ) {
    return this.calenderService.getCalender(
      session.username, session.password
    )
  }

  @Get('/getReportCalender')
  public async getReportCalender(
    @Session() session: Record<string, any>
  ) {
    return this.calenderService.getReportCalender(
      session.username, session.password
    )
  }
}
