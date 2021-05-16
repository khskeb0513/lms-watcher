import { Controller, Get } from '@nestjs/common';
import { CourseService } from '../../services/course.service';

@Controller('api/course')
export class CourseAPIController {
  constructor(private readonly courseService: CourseService) {
  }

  @Get('/getList')
  public getList() {
    return this.courseService.getList()
  }
}
