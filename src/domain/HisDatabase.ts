import Level from "level-ts";

const hisDatabase = new Level("./temp/his");

export default class HisDatabase {

  public getHisCode(item: string, username: string) {
    return hisDatabase.get(username + item);
  }

  public async setHisCode(item: string, hisCode: string, username: string) {
    if (!await hisDatabase.exists(username + item)) {
      await hisDatabase.put(username + item, hisCode);
      return true;
    } else {
      return true;
    }
  }

  public async getAllHisCode() {
    return await hisDatabase.all()
  }
}
