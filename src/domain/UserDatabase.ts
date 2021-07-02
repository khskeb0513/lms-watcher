import Level from "level-ts";

const userDatabase = new Level("./temp/user");

enum User {
  listOfUsername = "listOfUsername"
}

export default class UserDatabase {

  public async init() {
    if (!await userDatabase.exists(User.listOfUsername)) {
      await userDatabase.put(User.listOfUsername, []);
    }
    return true;
  }

  public async loadUsernameToList(username: string) {
    const usernames: Array<string> = await userDatabase.get(User.listOfUsername)
    if (!usernames.find(v => v === username)) {
      await userDatabase.put(User.listOfUsername, [...await userDatabase.get(User.listOfUsername), username])
    }
    return true
  }

  public async isUser(username: string): Promise<boolean> {
    return userDatabase.exists(username);
  }

  public async setUser(username: string, password: string): Promise<boolean> {
    await userDatabase.put(username, password);
    await this.init();
    await this.loadUsernameToList(username);
    return true;
  }

  public async getPassword(username: string): Promise<string> {
    return await userDatabase.get(username);
  }

  public async getUsers(): Promise<Array<string>> {
    return await userDatabase.get(User.listOfUsername);
  }
}
