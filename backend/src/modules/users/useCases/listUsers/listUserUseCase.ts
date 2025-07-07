import { IUserRepository } from "../../repositories/IUserRepository";
import { UserEntity } from "../../entities/users";
import { ListUserDTO } from "modules/users/dtos/listUserDTO";

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    params: ListUserDTO
  ): Promise<{ data: UserEntity[]; totalPages: number }> {
    const { page = 1, take = 10, orderField, orderDirection, search } = params;

    const data = await this.userRepository.findAll({
      page,
      take,
      search,
      orderField,
      orderDirection,
    });

    const total = await this.userRepository.countAll(params);
    const totalPages = Math.ceil(total / take);

    return { data, totalPages };
  }
}
