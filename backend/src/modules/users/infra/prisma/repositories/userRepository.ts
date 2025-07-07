import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../../prisma/prismaClient";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { CreateUserDTO } from "../../../dtos/createUserDTO";
import { UpdateUserDTO } from "../../../dtos/updateUserDTO";
import { ListUserDTO } from "../../../dtos/listUserDTO";
import { UserEntity } from "modules/users/entities/users";

export class UsersRepository implements IUserRepository {
  async countAll(params: Partial<ListUserDTO>): Promise<number> {
    const { search } = params;

    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { national: { contains: search } },
        { contact: { contains: search } },
      ];
    }

    return await prisma.user.count({ where });
  }

  async create(data: CreateUserDTO, createdById: string): Promise<UserEntity> {
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

    return this.mapUserToEntity(user);
  }

  async findAll(params: ListUserDTO): Promise<UserEntity[]> {
    const {
      page = 1,
      take = 10,
      search,
      orderField = "name",
      orderDirection = "asc",
    } = params;

    const skip = (page - 1) * take;

    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { national: { contains: search, mode: "insensitive" } },
              { contact: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      skip,
      take,
      orderBy: {
        [orderField]: orderDirection,
      },
    });

    return users.map((user) => this.mapUserToEntity(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) return null;

    return this.mapUserToEntity(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;

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
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedById,
      },
    });
  }

  private mapUserToEntity(user: User): UserEntity {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      national: user.national,
      contact: user.contact,
      password: user.password,
      token: user.token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      isDeleted: user.isDeleted,
      createdById: user.createdById,
      deletedById: user.deletedById,
      updatedByID: user.updatedByID,
    };
  }
}
