import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as session from "express-session";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  app.use(
    session({
      secret: "{t-{Y{^De93,c/WakaCa",
      resave: false,
      saveUninitialized: true
    })
  );
  const port = process.env["PORT"] || 3000;
  await app.listen(port);
}

(async () => {
  await bootstrap();
})();
