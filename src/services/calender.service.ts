import { Injectable } from "@nestjs/common";
import { SessionService } from "./session.service";
import got from "got";
import * as cheerio from "cheerio";
import * as moment from "moment";

@Injectable()
export class CalenderService {
  constructor(private readonly sessionService: SessionService) {}

  public async getCalender(username: string, password: string) {
    const cookie = await this.sessionService.getLoginSession(
      username,
      password
    );
    const body = (
      await got.post(
        "https://lms.pknu.ac.kr/ilos/main/main_schedule_view.acl",
        {
          headers: { cookie }
        }
      )
    ).body;
    const $ = cheerio.load(body);
    return $("div.schedule-Detail-Box")
      .toArray()
      .map((v) => {
        const dateStr = $(v).children().last().html();
        if (dateStr.length === 23) {
          const [startDateStr, endDateStr] = dateStr.split(" ~ ");
          return {
            title: $(v).children().first().html(),
            startDate: new Date(startDateStr),
            endDate: new Date(endDateStr)
          };
        } else return null;
      })
      .filter((v) => !!v)
      .sort((a, b) => a.startDate.valueOf() - b.startDate.valueOf());
  }

  public async getReportCalender(username: string, password: string) {
    const cookie = await this.sessionService.getLoginSession(
      username,
      password
    );
    const body = (
      await got.post(
        "https://lms.pknu.ac.kr/ilos/main/main_schedule_view.acl",
        {
          headers: { cookie }
        }
      )
    ).body;
    const $ = cheerio.load(body);
    return $("a.site-link")
      .toArray()
      .map((v) => {
        const detailArr = $(v)
          .children()
          .toArray()
          .map((v) => {
            return $(v).text();
          });
        const submitStatusStr = detailArr.find((v) => v.includes("상태 : ")),
          submitStatus = !!submitStatusStr
            ? !submitStatusStr.includes("미제출")
            : null;
        const parseDate = (str: string) => {
          const onlyNumber = [...str]
            .map((v) => parseInt(v, 10))
            .filter((v) => !!v || v === 0)
            .join("");
          if (onlyNumber.length === 0) return null;
          else {
            if (onlyNumber.length === 12) {
              const date = moment.utc(onlyNumber, "YYYYMMDDHHmmss");
              return str.includes("오전") ? date : date.add(12, "hours");
            } else {
              const date = moment.utc(
                onlyNumber.slice(0, 8) + "0" + onlyNumber.slice(8, 11),
                "YYYYMMDDHHmm"
              );
              return str.includes("오전") ? date : date.add(12, "hours");
            }
          }
        };
        const endDate = parseDate(
          String(detailArr.find((v) => v.includes("마감일")))
        );
        const lateEndDate = parseDate(
          String(detailArr.find((v) => v.includes("지각")))
        );
        const reportTitle = String(
          $(v)
            .parent()
            .parent()
            .first()
            .find("div.schedule-show-control")
            .text()
        )
          .replace(/\n/gi, "")
          .replace(/ {2}/g, "");
        return {
          reportTitle,
          courseTitle: String(detailArr[0])
            .replace(/\n/gi, "")
            .replace(/ {2}/g, ""),
          endDate,
          lateEndDate,
          submitStatus
        };
      })
      .sort((a, b) => a.endDate.valueOf() - b.endDate.valueOf());
  }
}
