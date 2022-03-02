import * as pactum from "pactum";

import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/shared/modules/prisma/prisma.service";

import { AuthService } from "../../auth.service";
import { User } from "@prisma/client";

import "@/tests/handlers/register-user.handler";

describe("AuthModule E2E", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = app.get(PrismaService);
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

  describe("[POST] /auth/register", () => {
    it("Should return error due to missing params", () => {
      return pactum.spec().post("/auth/register").expectStatus(400);
    });

    it("Should return successful registration", () => {
      const user = {
        name: "test",
        email: "test@mail.com",
        password: "test",
      };

      return pactum
        .spec()
        .post("/auth/register")
        .withBody(user)
        .expectStatus(201)
        .expectJsonLike({
          user: {
            name: user.name,
            email: user.email,
          },
        });
    });
  });

  describe("[POST] /auth/login", () => {
    it("Should return error due to missing params", () => {
      return pactum.spec().post("/auth/login").expectStatus(400);
    });

    it("Should return successful registration", async () => {
      const user = {
        name: "test",
        email: "test@mail.com",
        password: "test",
      };

      const auth = await authService.register(user);

      return pactum
        .spec()
        .post("/auth/login")
        .withBody(user)
        .expectStatus(200)
        .expectJsonLike({
          user: {
            name: user.name,
            email: user.email,
          },
          accessToken: auth.accessToken,
        })
        .expectCookiesLike("refresh_token", auth.refreshToken);
    });
  });

  describe("[GET] /auth", () => {
    it("Should return unauthorized error", () => {
      return pactum.spec().get("/auth").expectStatus(401);
    });

    it("Should return user", async () => {
      const user: User = await pactum.spec("RegisterUser").toss();

      return pactum
        .spec()
        .get("/auth")
        .withHeaders({
          authorization: "Bearer $S{AccessToken}",
        })
        .expectStatus(200)
        .expectJsonLike(user);
    });
  });
});
