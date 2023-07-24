import express from "express";
import * as productsController from "../controllers/productsController.js";

export const productsRouter = express.Router();

productsRouter.get("/", productsController.getProducts);

productsRouter.post("/", productsController.addProduct);

productsRouter.get("/:pid", productsController.getProductById);

productsRouter.put("/:pid", productsController.updateProduct);

productsRouter.delete("/:pid", productsController.deleteProduct);
