import * as pactum from "pactum";

import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/shared/modules/prisma/prisma.service";
import { AuthService } from "@/modules/auth/auth.service";
import auth from "@/tests/auth";

import { UserService } from "../../user.service";

describe("User E2E", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userService: UserService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prismaService = app.get(PrismaService);
    userService = app.get(UserService);
    authService = app.get(AuthService);

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(0);

    pactum.request.setBaseUrl(
      (await app.getUrl()).replace("[::1]", "localhost"),
    );
  });

  afterAll(async () => {
    await prismaService.cleanDb();
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.cleanDb();
  });

  describe("[GET] users", () => {
    it("Should return unauthenticated", () => {
      return pactum.spec().get("/users").expectStatus(401);
    });

    it("Should return users", async () => {
      const { user, accessToken } = await auth(userService, authService);

      return pactum
        .spec()
        .get("/users")
        .withHeaders({
          authorization: `Bearer ${accessToken}`,
        })
        .expectStatus(200)
        .expectJsonLike([
          {
            name: user.name,
            email: user.email,
          },
        ]);
    });
  });
});
