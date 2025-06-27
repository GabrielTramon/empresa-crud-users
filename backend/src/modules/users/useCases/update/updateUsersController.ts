import { Request, Response } from "express";
import { UpdateUserUseCase } from "./updateUsersUseCase";


export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedUser = await this.updateUserUseCase.update(id, data);

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
