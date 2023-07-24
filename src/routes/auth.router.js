import express from "express";
import { isUser, esAdmin } from "../services/auth.services.js"; 
import * as authController from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.get("/login", authController.renderLogin);

authRouter.post("/login", authController.login);

authRouter.get("/register", authController.renderRegister);

authRouter.post("/register", authController.register);

authRouter.get("/perfil", isUser, esAdmin, authController.getPerfil);

authRouter.get("/logout", authController.logout);

authRouter.get("/profile", isUser, esAdmin, authController.redirectProfile);
