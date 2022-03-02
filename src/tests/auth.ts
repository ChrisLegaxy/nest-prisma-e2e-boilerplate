/**
 * ? Not deprecated, but trying to use pactum handler instead [register-user.handler.ts]
 */
import { AuthService } from "@/modules/auth/auth.service";
import { UserService } from "@/modules/user/user.service";

import { user } from "./fixtures/user";

const auth = async (userService: UserService, authService: AuthService) => {
  const createdUser = await userService.create(user);

  return {
    user: createdUser,
    accessToken: await authService.signAccessToken(createdUser),
    refreshToken: await authService.signRefreshToken(createdUser),
  };
};

export default auth;
