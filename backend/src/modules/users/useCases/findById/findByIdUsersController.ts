import { Request, Response } from "express";
import { FindByIdUsersUseCase } from "./FindByIdUsersUseCase";


export class FindByIdUsersController {
  constructor(private findByIdUseCase: FindByIdUsersUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;  // pega o id da URL (/users/:id)
      const user = await this.findByIdUseCase.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
}
