import { Request, Response } from "express";
import { FindAllUsersUseCase } from "./findAllUserUseCase";
import { UserEntity } from "modules/users/entities/users";


export class FindAllUsersController {
  constructor(private findAllUseCase: FindAllUsersUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const users: UserEntity[] = await this.findAllUseCase.findAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
    