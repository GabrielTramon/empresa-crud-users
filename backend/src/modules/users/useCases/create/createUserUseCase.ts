import { User } from "@prisma/client";
import { CreateUserDTO } from "modules/users/dtos/createUserDTO";
import { IUserRepository } from "modules/users/repositories/IUserRepository";

export class CreateUserUseCase{
  constructor(private userRepository: IUserRepository){}

  async createUser(data: CreateUserDTO, createdById: string): Promise<User> {
    const user = await this.userRepository.create(data, createdById);
    return user;
  }
}