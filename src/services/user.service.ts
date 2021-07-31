import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ScheduleService } from "./schedule.service";
import { ReportService } from "./report.service";
import { SessionService } from "./session.service";
import { CalenderService } from "./calender.service";
import * as moment from "moment";
import got from "got";
import * as cheerio from "cheerio";

@Injectable()
export class UserService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly scheduleService: ScheduleService,
    private readonly reportService: ReportService,
    private readonly calenderService: CalenderService
  ) {
  }

  public async getUsername(cookie: string) {
    const response = await got.get("https://lms.pknu.ac.kr/ilos/mp/myinfo_form.acl", {
      headers: {
        cookie
      }
    });
    const $ = cheerio.load(response.body);
    const str = $("#uploadForm > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(2)").html();
    return str ? str.slice(str.indexOf("(") + 1, str.length - 1) : null;
  }

  public async getIncompleteSchedule(cookie: string) {
    const courseArr = await this.courseService.getList(cookie);
    const data = [];
    for (let i = 0; i < courseArr.length; i++) {
      data.push({
        ...courseArr[i],
        incomplete: await this.scheduleService.getByCourseIdExceptComplete(
          courseArr[i].id,
          cookie
        )
      });
    }
    return data;
  }

  public async getSchedule(cookie: string) {
    const courseArr = await this.courseService.getList(cookie);
    return Promise.all(
      courseArr.map(async (v) => {
        return {
          ...v,
          incomplete: await this.scheduleService.getByCourseId(
            v.id, cookie
          )
        };
      })
    );
  }

  public async getIncompleteReport(cookie: string) {
    const courseArr = await this.courseService.getList(cookie);
    return Promise.all(
      courseArr.map(async (v) => {
        return {
          ...v,
          incomplete: await this.reportService.getByCourseIdExceptComplete(
            v.id,
            cookie
          )
        };
      })
    );
  }

  public async getCalender(cookie: string) {
    return (await this.calenderService.getCalender(cookie))
      .filter((v) => new Date().valueOf() < v.startDate.valueOf())
      .map((v) => {
        return {
          ...v,
          startDate: moment(v.startDate).format("YYYY-MM-DD"),
          endDate: moment(v.endDate).format("YYYY-MM-DD")
        };
      });
  }

  public async getReportCalender(cookie: string) {
    return (await this.calenderService.getReportCalender(cookie))
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
}
