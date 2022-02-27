import { Module } from "@nestjs/common";
import { PrismaModule } from "./shared/modules/prisma/prisma.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

const commonModules = [PrismaModule];
const modules = [AuthModule, UserModule];
@Module({
  imports: [...commonModules, ...modules],
})
export class AppModule {}
