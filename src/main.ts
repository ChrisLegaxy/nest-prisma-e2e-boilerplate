import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./shared/modules/prisma/prisma.service";
import * as cookieParser from "cookie-parser";
import { initSwagger } from "./swagger/init";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({}));
  app.use(cookieParser());
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();
