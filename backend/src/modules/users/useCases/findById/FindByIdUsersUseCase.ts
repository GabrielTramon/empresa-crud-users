import { UserEntity } from "modules/users/entities/users";
import { IUserRepository } from "modules/users/repositories/IUserRepository";

export class FindByIdUsersUseCase{
    constructor(private userRepository: IUserRepository){}

    async findById(id: string): Promise<UserEntity | null>{
        const user = await this.userRepository.findById(id)
        return user
    }
}