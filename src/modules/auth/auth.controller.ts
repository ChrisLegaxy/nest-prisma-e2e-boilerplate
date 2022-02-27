import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard";

import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res() response: Response,
  ) {
    const auth = await this.authService.register(registerDto);

    await response.cookie("refresh_token", auth.refreshToken, {
      httpOnly: true,
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    delete auth.refreshToken;

    return await response.json(auth);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginUserDto, @Res() response: Response) {
    const auth = await this.authService.login(loginDto);

    await response.cookie("refresh_token", auth.refreshToken, {
      httpOnly: true,
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    delete auth.refreshToken;

    return await response.json(auth);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async current(@Req() request: Request) {
    return request.user;
  }

  @Get("refresh")
  async refresh(@Req() request: Request) {
    const token = request.cookies?.refresh_token;

    if (!token) throw new UnauthorizedException("Refresh Token Not Found");

    return await this.authService.refresh(token);
  }

  @Get("logout")
  async logout(@Res() response: Response) {
    response.clearCookie("refresh_token", {
      path: "/auth/refresh",
    });

    return response.end();
  }
}
