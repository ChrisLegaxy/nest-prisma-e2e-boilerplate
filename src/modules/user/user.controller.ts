import { Controller, Get, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard";

import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get() {
    return await this.userService.find();
  }
}
