import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "@/modules/user/user.service";
import { PrismaService } from "@/shared/modules/prisma/prisma.service";

import { AuthService } from "../../auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
