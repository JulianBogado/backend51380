import express from "express";
import * as cartsController from "../controllers/cartsControllers.js";

export const cartsRouter = express.Router();

cartsRouter.get("/:cid", cartsController.getCartById);

cartsRouter.post("/", cartsController.createCart);

cartsRouter.post("/:cid/product/:pid", cartsController.addProductToCart);

cartsRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);

cartsRouter.delete("/:cid", cartsController.emptyCart);

cartsRouter.put("/:cid", cartsController.updateCart);

cartsRouter.put("/:cid/product/:pid", cartsController.updateProductFromCart);
