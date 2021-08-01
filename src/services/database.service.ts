import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class DatabaseService {

  public async getAllHisList() {
    // /hisList/username/item/ => hisCode
    const db = admin.database();
    const response = await db.ref("/hisCode").get();
    return response.val();
  }

  public async getHisListByUsernameItem(username: string, item: number) {
    const db = admin.database();
    const response = await db.ref(`/hisCode/${username}/${item}`).get();
    return response.val();
  }

  public async setHis(his: number, username: string, item: number) {
    if (his && username && item) {
      const timestamp = new Date().valueOf();
      const db = admin.database();
      const itemRequest = await db.ref(`/hisCode/${username}/${item}/hisCode`);
      const timestampRequest = await db.ref(`/hisCode/${username}/${item}/timestamp`);
      itemRequest.set(his);
      timestampRequest.set(timestamp);
      return {
        his, timestamp
      };
    }
  }
}
