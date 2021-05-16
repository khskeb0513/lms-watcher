import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '../../services/report.service';

@Controller('api/report')
export class ReportAPIController {
  constructor(private readonly reportService: ReportService) {
  }

  @Get('/getByCourseId')
  public getByCourseId(
    @Query('id') kjKey: string,
  ) {
    return this.reportService.getByCourseId(kjKey);
  }

  @Get('/getByCourseIdExceptComplete')
  public getByCourseIdExceptComplete(
    @Query('id') kjKey: string,
  ) {
    return this.reportService.getByCourseIdExceptComplete(kjKey);
  }
}
