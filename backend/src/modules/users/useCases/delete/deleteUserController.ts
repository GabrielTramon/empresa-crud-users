import { Request, Response } from "express";
import { DeleteUserUseCase } from "./deleteUserUseCase";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { deletedById } = req.body;

    try {
      await this.deleteUserUseCase.delete(id, deletedById);
      return res.status(200).json({ message: "Usuário deletado com sucesso (soft delete)." });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao deletar o usuário." });
    }
  }
}
