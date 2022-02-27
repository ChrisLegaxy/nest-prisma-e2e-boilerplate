import * as argon2 from "argon2";

import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

import { UserService } from "../user/user.service";
import { LoginUserDto, RegisterUserDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      registerDto.email,
    );

    if (existingUser)
      throw new UnprocessableEntityException("User already registered");

    const user = await this.userService.create(registerDto);

    return {
      user,
      accessToken: await this.signAccessToken(user),
      refreshToken: await this.signRefreshToken(user),
    };
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user || !(await argon2.verify(user.password, loginDto.password)))
      throw new UnauthorizedException("Incorrect Credentials");

    return {
      user,
      accessToken: await this.signAccessToken(user),
      refreshToken: await this.signRefreshToken(user),
    };
  }

  async refresh(token: string) {
    const verifiedToken = await this.jwtService.verifyAsync(token);

    if (!verifiedToken) throw new UnauthorizedException("Invalid Token");

    const user = await this.userService.findOneById(verifiedToken.sub);

    if (!user) throw new UnauthorizedException("Invalid Token");

    delete user.password;

    return {
      user,
      accessToken: await this.signAccessToken(user),
    };
  }

  async signAccessToken(user: Partial<User>) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });
  }

  async signRefreshToken(user: Partial<User>) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: "365d",
    });
  }
}
