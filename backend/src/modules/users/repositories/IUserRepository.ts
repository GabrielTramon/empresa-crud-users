import { CreateUserDTO } from "../dtos/createUserDTO";
import { UserEntity } from "../entities/users";
import { UpdateUserDTO } from "../dtos/updateUserDTO";

export interface IUserRepository{
    create(data:CreateUserDTO, createdById: string): Promise<UserEntity>
    findAll(): Promise<UserEntity[]>
    findById(id: string): Promise<UserEntity|null>
    update(id: string, data: UpdateUserDTO): Promise<UserEntity>;
    delete(id:string, deletedById: string): Promise<void>
}