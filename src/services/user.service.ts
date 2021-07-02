import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ScheduleService } from "./schedule.service";
import { ReportService } from "./report.service";
import { SessionService } from "./session.service";
import { CalenderService } from "./calender.service";
import * as moment from "moment";
import got from "got";
import UserDatabase from "../domain/UserDatabase";
import HisDatabase from "../domain/HisDatabase";

@Injectable()
export class UserService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly scheduleService: ScheduleService,
    private readonly reportService: ReportService,
    private readonly calenderService: CalenderService,
    private readonly userDatabase: UserDatabase,
    private readonly hisDatabase: HisDatabase
  ) {
  }

  public async fulfillSchedule(username: string, password: string) {
    const response = await this.getIncompleteHisCode(username, password);
    const cookie = await this.sessionService.getLoginSession(
      username,
      password
    );
    await got.post("https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl", {
      headers: { cookie },
      searchParams: {
        KJKEY: response.length !== 0 ? response[0][0]["kjKey"] : null,
        returnData: "json",
        returnURI: "%2Filos%2Fst%2Fcourse%2Fsubmain_form.acl",
        encoding: "utf-8"
      }
    });
    response.forEach(byCourse => {
      byCourse.forEach(async item => {
        console.log({ item: item.item, username, his: await this.hisDatabase.getHisCode(item.item, username) });
        const form = {
          lecture_weeks: item.seq,
          item_id: item.item,
          link_seq: item.seq,
          his_no: await this.hisDatabase.getHisCode(item.item, username),
          ky: item.kjKey,
          ud: username,
          returnData: "json",
          encoding: "utf-8"
        };
        await got.post("https://lms.pknu.ac.kr/ilos/st/course/online_view_status.acl", {
          headers: {
            cookie
          }, form
        });
      });
    });
  }

  public async getAllUserHisCode() {
    return await this.hisDatabase.getAllHisCode();
  }

  public async getIncompleteHisCode(username: string, password: string) {
    return await Promise.all((await this.getIncompleteSchedule(username, password)).filter(v => {
      return v.incomplete.length !== 0;
    }).map(async v => {
      return await Promise.all(v.incomplete.map(async item => {
        return {
          ...item,
          his: await this.scheduleService.getHisCode(item.item, item.seq, item.kjKey, username, username, password)
        };
      }));
    }));
  }

  public async getUsers() {
    return this.userDatabase.getUsers();
  }

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

  public async getSchedule(username: string, password: string) {
    const courseArr = await this.courseService.getList(username, password);
    return Promise.all(
      courseArr.map(async (v) => {
        return {
          ...v,
          incomplete: await this.scheduleService.getByCourseId(
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
