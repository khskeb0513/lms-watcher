import { Controller, Get, Render, Session } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller()
export class IndexController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get("/")
  @Render("index")
  public async root(@Session() session: Record<string, any>) {
    session.cookieStr = 'JSESSIONID=1pJuzht6lz98rgdiYqcwijKRJDylXSbawLMU0fyYke9ClWpEpaOKeWurGSF4KFra.UExNUy9wbG1zNjM='
    return {
      username: session.cookieStr ? await this.userService.getUsername(session.cookieStr) : null
    };
  }
}
