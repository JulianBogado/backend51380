import express from "express";
import * as mockController from "../controllers/mockController.js";

export const mockingRouter = express.Router();

mockingRouter.get("/", mockController.getMockProducts);