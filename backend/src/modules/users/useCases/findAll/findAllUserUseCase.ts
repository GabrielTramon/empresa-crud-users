import { UserEntity } from "modules/users/entities/users";
import { IUserRepository } from "modules/users/repositories/IUserRepository";

export class FindAllUsersUseCase{
    constructor(private userRepository: IUserRepository){}

    async findAll(): Promise<UserEntity[]>{
        const user = await this.userRepository.findAll()
        return user
    }
}