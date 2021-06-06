import { Injectable } from "@nestjs/common";
import got from "got";

@Injectable()
export class SessionService {
  public async getLoginSession(username: string, password: string) {
    const request = await got.post("https://lms.pknu.ac.kr/ilos/lo/login.acl", {
      form: {
        usr_id: username,
        usr_pwd: password
      }
    });
    return String(request.headers["set-cookie"]).split(";")[0];
  }

  public async moveKj(cookie: string, kjKey: string) {
    await got.post("https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl", {
      headers: { cookie },
      searchParams: {
        KJKEY: kjKey,
        returnData: "json",
        returnURI: "%2Filos%2Fst%2Fcourse%2Fsubmain_form.acl",
        encoding: "utf-8"
      }
    });
  }
}
