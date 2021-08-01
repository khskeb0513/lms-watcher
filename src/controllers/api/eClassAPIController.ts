import { Controller, Get, Session } from "@nestjs/common";
import { EClassService } from "../../services/eClass.service";

@Controller("api/eClass")
export class EClassAPIController {
  constructor(private readonly eClassService: EClassService) {}

  @Get("/getList")
  public getList(@Session() session: Record<string, any>) {
    return this.eClassService.getList(session.cookieStr);
  }
}
