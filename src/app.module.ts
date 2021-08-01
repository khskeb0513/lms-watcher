import { Module } from "@nestjs/common";
import { EClassAPIController } from "./controllers/api/eClassAPIController";
import { ScheduleAPIController } from "./controllers/api/scheduleAPI.controller";
import { UserAPIController } from "./controllers/api/userAPI.controller";
import { ReportAPIController } from "./controllers/api/reportAPI.controller";
import { UserController } from "./controllers/user.controller";
import { CalenderAPIController } from "./controllers/api/calenderAPI.controller";
import { IndexController } from "./controllers/index.controller";
import { EClassService } from "./services/eClass.service";
import { ScheduleService } from "./services/schedule.service";
import { SessionService } from "./services/session.service";
import { DatabaseService } from "./services/database.service";
import { UserService } from "./services/user.service";
import { CommonService } from "./services/common.service";
import { ReportService } from "./services/report.service";
import { CalenderService } from "./services/calender.service";


@Module({
  imports: [],
  controllers: [
    EClassAPIController,
    ScheduleAPIController,
    UserAPIController,
    ReportAPIController,
    UserController,
    CalenderAPIController,
    IndexController
  ],
  providers: [
    EClassService,
    ScheduleService,
    SessionService,
    DatabaseService,
    UserService,
    CommonService,
    ReportService,
    CalenderService
  ]
})
export class AppModule {
}
