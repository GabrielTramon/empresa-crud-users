import { IUserRepository } from "modules/users/repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async delete(id: string, deletedById: string): Promise<void> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    await this.userRepository.delete(id, deletedById);
  }
}
