import { Request, Response } from "express";
import { UsersRepository } from "../../infra/prisma/repositories/userRepository";
import { FindAllUsersUseCase } from "../listUsers/listUserUseCase";

export class FindAllUsersController {
  async handle(req: Request, res: Response) {

    const {
      page = "1",
      take = "10",
      search = "",
      orderField = "name",
      orderDirection = "asc",
    } = req.query;

    const repository = new UsersRepository();
    const useCase = new FindAllUsersUseCase(repository);

    const result = await useCase.execute({
      page: Number(page),
      take: Number(take),
      search: String(search),
      orderField: String(orderField),
      orderDirection: orderDirection === "desc" ? "desc" : "asc",
    });
    
    return res.json(result);
    
  }
}
