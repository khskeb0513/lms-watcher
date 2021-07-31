import { Injectable } from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";
import { SessionService } from "./session.service";

@Injectable()
export class CourseService {

  public async getList(cookie: string) {
    const response = await got.post(
      "https://lms.pknu.ac.kr/ilos/mp/course_register_list.acl",
      {
        headers: { cookie },
        searchParams: {
          YEAR: 2021,
          TERM: 2
        }
      }
    );
    const $ = cheerio.load(response.body);
    return $("a.site-link")
      .toArray()
      .map((v) => {
        const title = $(v).children().first().html();
        return title !== "수강취소하기" ? {
          title, id: $(v).attr()["onclick"].split('\'')[1]
        } : null;
      }).filter(v => !!v);
  }
}
