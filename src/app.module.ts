import { Module } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { CourseAPIController } from './controllers/api/courseAPI.controller';
import { ScheduleService } from './services/schedule.service';
import { ScheduleAPIController } from './controllers/api/scheduleAPI.controller';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { CommonService } from './services/common.service';
import { UserAPIController } from './controllers/api/userAPI.controller';
import { ReportService } from './services/report.service';
import { ReportAPIController } from './controllers/api/reportAPI.controller';
import { CalenderService } from './services/calender.service';
import { CalenderAPIController } from './controllers/api/calenderAPI.controller';
import { IndexController } from './controllers/index.controller';

@Module({
  imports: [],
  controllers: [CourseAPIController, ScheduleAPIController, UserAPIController, ReportAPIController, UserController, CalenderAPIController, IndexController],
  providers: [CourseService, ScheduleService, SessionService, UserService, CommonService, ReportService, CalenderService],
})
export class AppModule {}
