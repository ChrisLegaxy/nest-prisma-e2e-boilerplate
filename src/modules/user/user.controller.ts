import { Controller, Get, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard";

import { UserService } from "./user.service";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth("AccessToken")
  @ApiResponse({ status: 200, description: "Return array of users" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Get()
  async get() {
    return await this.userService.find();
  }
}
