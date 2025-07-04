import "reflect-metadata";
import express from "express";
import { userRoutes } from "./modules/users/routes/userRouter";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/", userRoutes)


app.listen(3001, () => console.log("Server running at http://localhost:3001"));
