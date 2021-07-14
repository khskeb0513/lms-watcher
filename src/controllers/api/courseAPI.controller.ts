import { Controller, Get, Session } from "@nestjs/common";
import { CourseService } from "../../services/course.service";

@Controller("api/course")
export class CourseAPIController {
  constructor(private readonly courseService: CourseService) {}

  @Get("/getList")
  public getList(@Session() session: Record<string, any>) {
    return this.courseService.getList(session.cookieStr);
  }
}
