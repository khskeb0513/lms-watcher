import { Injectable } from '@nestjs/common';
import got from 'got';
import * as cheerio from 'cheerio';
import { SessionService } from './session.service';

@Injectable()
export class CourseService {

  constructor(
    private readonly sessionService: SessionService
  ) {
  }

  public async getList() {
    const cookie = await this.sessionService.getLoginSession();
    const body = await got.post(
      'https://lms.pknu.ac.kr/ilos/mp/course_register_list.acl',
      {
        headers: { cookie },
        searchParams: {
          YEAR: 2021,
          TERM: 1,
        },
      },
    );
    const $ = cheerio.load(body.body);
    return $('a.site-font-color')
      .toArray()
      .map((v) => {
        return {
          title: $(v).children().first().html(),
          id: $(v).attr()['onclick'].slice(12, 27),
        };
      });
  }
}
