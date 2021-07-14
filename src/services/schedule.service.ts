import { Injectable } from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";
import { SessionService } from "./session.service";
import { CommonService } from "./common.service";
import { CourseService } from "./course.service";
import HisDatabase from "../domain/HisDatabase";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly commonService: CommonService,
    private readonly courseService: CourseService,
    private readonly hisDatabase: HisDatabase
  ) {
  }

  public async getByCourseId(id: string, cookie: string) {
    await got.post("https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl", {
      headers: { cookie },
      searchParams: {
        KJKEY: id,
        returnData: "json",
        returnURI: "%2Filos%2Fst%2Fcourse%2Fsubmain_form.acl",
        encoding: "utf-8"
      }
    });
    const body = await got.get(
      "https://lms.pknu.ac.kr/ilos/st/course/online_list.acl",
      {
        headers: { cookie }
      }
    );
    const $ = cheerio.load(body.body);
    const percentArr = $("div#per_text")
      .toArray()
      .map((v) => {
        return $(v).html();
      });
    let scheduleArr = $("span.site-mouseover-color")
      .toArray()
      .map((v) => {
        const name = $(v).html();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const viewGo = (
          week: string,
          seq: string,
          edDt: string,
          today: string,
          item: string
        ) => {
          return {
            seq: Number(seq),
            edDt: edDt,
            today: today,
            name,
            item: Number(item),
            kjKey: id
          };
        };
        return eval($(v).attr()["onclick"]);
      });
    for (const key in percentArr) {
      if (!!scheduleArr[key])
        scheduleArr[key] = { ...scheduleArr[key], percent: percentArr[key] };
    }
    scheduleArr = scheduleArr.map((v) => {
      return {
        ...v,
        edDt: this.commonService
          .dateParser(v.edDt)
          .format("YYYY년 MM월 DD일 HH:mm:ss"),
        d1:
          this.commonService
            .dateParser(v.edDt)
            .diff(this.commonService.dateParser(v.today).add(1, "d")) < 0,
        d2:
          this.commonService
            .dateParser(v.edDt)
            .diff(this.commonService.dateParser(v.today).add(2, "d")) < 0
      };
    });
    return scheduleArr;
  }

  public async getByCourseIdExceptComplete(
    id: string,
    cookie: string
  ) {
    const scheduleArr = await this.getByCourseId(id, cookie);
    return scheduleArr.filter((v) => v.percent !== "100%");
  }

  public async getHisCode(
    itemId,
    seq,
    kjKey,
    ud,
    cookie: string
  ) {
    await got.post("https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl", {
      headers: { cookie },
      searchParams: {
        KJKEY: kjKey,
        returnData: "json",
        returnURI: "%2Filos%2Fst%2Fcourse%2Fsubmain_form.acl",
        encoding: "utf-8"
      }
    });
    const body = await got.post(
      "https://lms.pknu.ac.kr/ilos/st/course/online_view_hisno.acl",
      {
        headers: { cookie },
        form: {
          lecture_weeks: seq,
          item_id: itemId,
          link_seq: seq,
          kjkey: kjKey,
          _KJKEY: kjKey,
          ky: kjKey,
          ud: ud,
          returnData: "json",
          encoding: "utf-8"
        }
      }
    );
    return parseInt(JSON.parse(body.body)["his_no"]);
  }
}
