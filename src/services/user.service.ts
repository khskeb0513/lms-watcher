import { Injectable } from '@nestjs/common';
import { CourseService } from './course.service';
import { ScheduleService } from './schedule.service';
import { ReportService } from './report.service';
import { SessionService } from './session.service';
import { CalenderService } from './calender.service';
import * as moment from 'moment';

@Injectable()
export class UserService {

  constructor(
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly scheduleService: ScheduleService,
    private readonly reportService: ReportService,
    private readonly calenderService: CalenderService,
  ) {
  }

  public async getIncompleteSchedule() {
    const courseArr = await this.courseService.getList();
    return Promise.all(courseArr.map(async v => {
      return {
        ...v,
        incomplete: await this.scheduleService.getByCourseIdExceptComplete(v.id),
      };
    }));
  }

  public async getIncompleteReport() {
    const courseArr = await this.courseService.getList();
    return Promise.all(courseArr.map(async v => {
      return {
        ...v,
        incomplete: await this.reportService.getByCourseIdExceptComplete(v.id),
      };
    }));
  }

  public async setBrowserLoginSession(username: string, password: string) {
    const userInformation = await this.sessionService.getUserInformation();
    return (username === userInformation.username && password === userInformation.password)
      ? { userInformation }
      : { userInformation: null };
  }

  public async getCalender() {
    return (await this.calenderService.getCalender()).filter(v => (new Date().valueOf() < v.startDate.valueOf())).map(v => {
      return {
        ...v,
        startDate: moment(v.startDate).format('YYYY-MM-DD'),
        endDate: moment(v.endDate).format('YYYY-MM-DD'),
      };
    });
  }

  public async getReportCalender() {
    return (await this.calenderService.getReportCalender())
      .filter(v => v.endDate.valueOf() > new Date().valueOf())
      .map(v => {
        return {
          ...v,
          endDate: v.endDate ? v.endDate.toISOString() : null,
          lateEndDate: v.lateEndDate ? v.lateEndDate.toISOString() : null,
        };
      });
  }
}
