import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Nest Boilerplate")
    .setDescription("Nest API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Access Token",
        description: "Enter JWT access token",
        in: "header",
      },
      "AccessToken",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
};
