import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthdate?: Date;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  national?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
