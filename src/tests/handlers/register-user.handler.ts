import * as pactum from "pactum";

const { addSpecHandler } = pactum.handler;

addSpecHandler("RegisterUser", (ctx) => {
  const { spec } = ctx;
  const user = {
    name: "test",
    email: "test@mail.com",
    password: "test",
  };

  spec.post("/auth/register");
  spec.withBody(user);

  spec.expectStatus(201);
  spec.expectJsonSchema({ type: "object" });
  spec.expectJsonLike({
    user: {
      ...() => {
        delete user.password;
        return user;
      },
    },
  });

  spec.stores("AccessToken", "accessToken");
  spec.returns((ctx) => ctx.res.json["user"]);
});
