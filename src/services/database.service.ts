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

  public async getHisByUsernameItem(username: string, item: number) {
    const db = admin.database();
    const response = await db.ref(`/hisCode/${username}/${item}`).get();
    return response.val();
  }

  public async setHis(hisCode: number, username: string, item: number) {
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
