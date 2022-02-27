import * as argon2 from "argon2";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/shared/modules/prisma/prisma.service";

import { RegisterUserDto } from "../auth/dto/auth.dto";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async find() {
    return await this.prismaService.user.findMany();
  }

  async create(createDto: RegisterUserDto) {
    return await this.prismaService.user.create({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        name: true,
        password: false,
      },
      data: {
        ...createDto,
        password: await argon2.hash(createDto.password),
      },
    });
  }
}
