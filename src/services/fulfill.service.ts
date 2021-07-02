import { Injectable, Logger } from "@nestjs/common";
import HisDatabase from "../domain/HisDatabase";
import UserDatabase from "../domain/UserDatabase";
import { UserService } from "./user.service";

@Injectable()
export class FulfillService {
  constructor(
    private readonly hisDatabase: HisDatabase,
    private readonly userDatabase: UserDatabase,
    private readonly userService: UserService
  ) {
  }

  private readonly logger = new Logger(FulfillService.name);

  public async fulfillSchedule() {
    this.logger.debug("fulfillSchedule");
    const userArr = await this.userDatabase.getUsers();
    for (const username of userArr) {
      const password = await this.userDatabase.getPassword(username);
      await this.userService.fulfillSchedule(username, password);
    }
  }

  public async makeUserSync(username: string, password: string) {
    await this.userDatabase.setUser(username, password);
  }

  public async syncHisCode() {
    this.logger.debug("syncHisCode");
    const userArr = await this.userDatabase.getUsers();
    for (const username of userArr) {
      const password = await this.userDatabase.getPassword(username);
      this.userService.getIncompleteHisCode(username, password).then(r => {
        r.forEach(byCourse => {
          byCourse.forEach(item => {
            this.hisDatabase.setHisCode(item["item"], item["his"], username);
          });
        });
      });
    }
  }

}
