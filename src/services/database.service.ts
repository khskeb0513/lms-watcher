import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class DatabaseService {

  public async setContent(kjKey: string, item: string, cid: string, contentId: string) {
    const db = admin.database();
    const response = await db.ref(`content/${kjKey}/${item}`);
    response.child("/cid").set(cid);
    response.child("/contentId").set(contentId);
  }

  public async getHisByUsernameItem(username: string, item: string) {
    const db = admin.database();
    const response = await db.ref(`/hisCode/${username}/${item}`).get();
    return response.val();
  }

  public async setHis(hisCode: number, username: string, item: string) {
    if (hisCode && username && item) {
      const timestamp = new Date().valueOf();
      const db = admin.database();
      const itemRequest = await db.ref(`/hisCode/${username}/${item}/hisCode`);
      const timestampRequest = await db.ref(`/hisCode/${username}/${item}/timestamp`);
      itemRequest.set(hisCode);
      timestampRequest.set(timestamp);
      return {
        hisCode, timestamp
      };
    }
  }
}
