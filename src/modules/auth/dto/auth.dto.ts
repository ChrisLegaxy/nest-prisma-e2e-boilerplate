import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({
    type: String,
    example: "test",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: "test@mail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: "test@mail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
