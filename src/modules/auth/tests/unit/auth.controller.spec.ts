import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "@/modules/user/user.service";
import { PrismaService } from "@/shared/modules/prisma/prisma.service";

import { AuthController } from "../../auth.controller";
import { AuthService } from "../../auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        PrismaService,
        {
          provide: "JWT_MODULE_OPTIONS",
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
