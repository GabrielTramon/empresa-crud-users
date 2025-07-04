import { Router } from "express";
import { CreateUserController } from "../useCases/create/createUserController";
import { FindByIdUsersController } from "../useCases/findById/findByIdUsersController";
import { UsersRepository } from "../infra/prisma/repositories/userRepository";
import { FindByIdUsersUseCase } from "../useCases/findById/FindByIdUsersUseCase";
import { UpdateUserUseCase } from "../useCases/update/updateUsersUseCase";
import { UpdateUserController } from "../useCases/update/updateUsersController";
import { DeleteUserUseCase } from "../useCases/delete/deleteUserUseCase";
import { DeleteUserController } from "../useCases/delete/deleteUserController";
import { FindAllUsersController } from "../useCases/listUsers/listUserController";
import { FindAllUsersUseCase } from "../useCases/listUsers/listUserUseCase";

const userRoutes = Router();

const userRepository = new UsersRepository();

// CREATE
const createUserController = new CreateUserController();
userRoutes.post("/users", (req, res) => {
  return createUserController.handle(req, res);
});

// FIND BY ID
const findByIdUsersUseCase = new FindByIdUsersUseCase(userRepository);
const findByIdUsersController = new FindByIdUsersController(
  findByIdUsersUseCase
);
userRoutes.get("/users/user/:id", (req, res) => {
  return findByIdUsersController.handle(req, res);
});

// UPDATE
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const updateUserController = new UpdateUserController(updateUserUseCase);
userRoutes.put("/users/user/:id", (req, res) => {
  return updateUserController.handle(req, res);
});

const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);
userRoutes.patch("/users/user/:id/delete", (req, res) => {
  return deleteUserController.handle(req, res);
});

// FIND ALL USERS (com paginação, ordenação, busca)
const findAllUsersUseCase = new FindAllUsersUseCase(userRepository);
const findAllUsersController = new FindAllUsersController(findAllUsersUseCase);
userRoutes.get("/users", (req, res) => {
  return findAllUsersController.handle(req, res);
});


export { userRoutes };
