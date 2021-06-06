import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ScheduleService } from "./schedule.service";
import { ReportService } from "./report.service";
import { SessionService } from "./session.service";
import { CalenderService } from "./calender.service";
import * as moment from "moment";
import got from "got";

@Injectable()
export class UserService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly scheduleService: ScheduleService,
    private readonly reportService: ReportService,
    private readonly calenderService: CalenderService
  ) {}

  public async getIncompleteSchedule(username: string, password: string) {
    const courseArr = await this.courseService.getList(username, password);
    return Promise.all(
      courseArr.map(async (v) => {
        return {
          ...v,
          incomplete: await this.scheduleService.getByCourseIdExceptComplete(
            v.id,
            username,
            password
          )
        };
      })
    );
  }

  public async getIncompleteReport(username: string, password: string) {
    const courseArr = await this.courseService.getList(username, password);
    return Promise.all(
      courseArr.map(async (v) => {
        return {
          ...v,
          incomplete: await this.reportService.getByCourseIdExceptComplete(
            v.id,
            username,
            password
          )
        };
      })
    );
  }

  public async getCalender(username: string, password: string) {
    return (await this.calenderService.getCalender(username, password))
      .filter((v) => new Date().valueOf() < v.startDate.valueOf())
      .map((v) => {
        return {
          ...v,
          startDate: moment(v.startDate).format("YYYY-MM-DD"),
          endDate: moment(v.endDate).format("YYYY-MM-DD")
        };
      });
  }

  public async getReportCalender(username: string, password: string) {
    return (await this.calenderService.getReportCalender(username, password))
      .filter((v) => v.endDate.valueOf() > new Date().valueOf())
      .map((v) => {
        return {
          ...v,
          endDate: v.endDate ? v.endDate.format("~ YYYY/MM/DD HH:mm:ss") : null,
          lateEndDate: v.lateEndDate
            ? v.lateEndDate.format("~ YYYY/MM/DD HH:mm:ss")
            : null
        };
      });
  }

  public async isUser(username: string, password: string) {
    const body = (
      await got.post("https://lms.pknu.ac.kr/ilos/lo/login.acl", {
        form: {
          usr_id: username,
          usr_pwd: password
        }
      })
    ).body;
    return !body.includes("일치하지");
  }
}
