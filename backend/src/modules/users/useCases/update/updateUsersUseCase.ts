import { UpdateUserDTO } from "modules/users/dtos/updateUserDTO";
import { UserEntity } from "modules/users/entities/users";
import { IUserRepository } from "modules/users/repositories/IUserRepository";
import bcrypt from "bcrypt";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async update(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    // Verifica se o usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    // Se a senha for enviada, aplica o hash
    let hashedPassword: string | undefined = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Monta os dados a serem atualizados
    const updatedData = {
      ...data,
      password: hashedPassword ?? undefined, // Só atualiza se a senha for enviada
    };

    // Chama o repositório para atualizar
    const updatedUser = await this.userRepository.update(id, updatedData);

    return updatedUser;
  }
}
