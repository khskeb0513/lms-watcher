import { Controller, Get, Render, Session } from "@nestjs/common";

@Controller()
export class IndexController {

  @Get("/")
  @Render("index")
  public async root(@Session() session: Record<string, any>) {
    return {
      username: session.username
    };
  }
}
