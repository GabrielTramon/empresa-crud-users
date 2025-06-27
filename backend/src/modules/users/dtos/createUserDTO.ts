import { Type } from "class-transformer";
import { IsDate, IsEmail, IsString, IsStrongPassword, minLength, } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name: string;

    @IsDate()
    @Type(() => Date) 
    birthdate: Date;
    
    @IsString()
    contact: string;

    @IsString()
    national: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}
