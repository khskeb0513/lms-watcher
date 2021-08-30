import { Module } from "@nestjs/common";
import { EClassAPIController } from "./controllers/api/eClassAPIController";
import { ScheduleAPIController } from "./controllers/api/scheduleAPI.controller";
import { UserAPIController } from "./controllers/api/userAPI.controller";
import { ReportAPIController } from "./controllers/api/reportAPI.controller";
import { UserController } from "./controllers/user.controller";
import { CalendarAPIController } from "./controllers/api/calendarAPI.controller";
import { IndexController } from "./controllers/index.controller";
import { EClassService } from "./services/eClass.service";
import { ScheduleService } from "./services/schedule.service";
import { SessionService } from "./services/session.service";
import { DatabaseService } from "./services/database.service";
import { UserService } from "./services/user.service";
import { CommonService } from "./services/common.service";
import { ReportService } from "./services/report.service";
import { CalendarService } from "./services/calendar.service";
import { HappyDormService } from './services/happyDorm.service';
import { HappyDormAPIController } from './controllers/api/happyDormAPI.controller';


@Module({
  imports: [],
  controllers: [
    EClassAPIController,
    ScheduleAPIController,
    UserAPIController,
    ReportAPIController,
    UserController,
    CalendarAPIController,
    IndexController,
    HappyDormAPIController
  ],
  providers: [
    EClassService,
    ScheduleService,
    SessionService,
    DatabaseService,
    UserService,
    CommonService,
    ReportService,
    CalendarService,
    HappyDormService
  ]
})
export class AppModule {
}
