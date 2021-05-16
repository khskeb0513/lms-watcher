import { Controller, Get } from '@nestjs/common';
import { CalenderService } from '../../services/calender.service';

@Controller('api/calender')
export class CalenderAPIController {
  constructor(
    private readonly calenderService: CalenderService
  ) {
  }

  @Get('/getCalender')
  public async getCalender() {
    return this.calenderService.getCalender()
  }

  @Get('/getReportCalender')
  public async getReportCalender() {
    return this.calenderService.getReportCalender()
  }
}
