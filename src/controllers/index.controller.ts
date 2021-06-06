import { Controller, Get, Render, Session } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller()
export class IndexController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  @Render("index")
  public async root(@Session() session: Record<string, any>) {
    return {
      username: session.username
    };
  }
}
