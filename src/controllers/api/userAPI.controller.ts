import { Body, Controller, Post, Session } from "@nestjs/common";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";

@Controller("api/user")
export class UserAPIController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService
  ) {}

  @Post("/isUser")
  public async isUser(
    @Body("username") username: string,
    @Body("password") password: string,
    @Session() session: Record<string, any>
  ) {
    const isUser = await this.userService.isUser(username, password);
    if (isUser) {
      session.username = username;
      session.password = password;
    }
    return { isUser };
  }
}
