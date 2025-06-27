import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { CreateUserDTO } from "../../../dtos/createUserDTO";
import { prisma } from "../../../../../../prisma/prismaClient";
import { UserEntity } from "modules/users/entities/users";
import { UpdateUserDTO } from "modules/users/dtos/updateUserDTO";

export class UsersRepository implements IUserRepository {
  async create(data: CreateUserDTO, createdById: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        birthdate: new Date(data.birthdate),
        national: data.national,
        email: data.email,
        password: hashedPassword,
        contact: data.contact,
        token: "",
        isDeleted: false,
        createdById,
      },
    });

    return user;
  }

  // Função privada para converter User (Prisma) em UserEntity
  private mapUserToEntity(user: User): UserEntity {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      national: user.national,
      contact: user.contact,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Corrigido para usar arrow function e preservar 'this'
    return users.map(user => this.mapUserToEntity(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user || user.isDeleted) return null;

    return this.mapUserToEntity(user);
  }
    // Método update
    async update(id: string, data: UpdateUserDTO): Promise<UserEntity | null> {
      // Se vier senha, precisa hashear
      let hashedPassword: string | undefined = undefined;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }
  
      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name: data.name,
            birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
            national: data.national,
            email: data.email,
            password: hashedPassword,
            contact: data.contact,
            updatedAt: new Date(),
          },
        });
  
        return this.mapUserToEntity(updatedUser);
      } catch (error) {
        // Se não encontrar usuário, Prisma lança erro, trate aqui e retorne null
        return null;
      }
    }
      // Método para "deletar" o usuário (soft delete)
  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }

}
