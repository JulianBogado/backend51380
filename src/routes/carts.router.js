import express from "express";

import { CartService } from "../services/cart.services.js";

export const cartsRouter = express.Router();

const ServiceCart = new CartService();


cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await ServiceCart.getCartById(req.params.cid);
    if (cart) {
      res.status(200).json({
        status: "Success",
        msg: "Cart encontrado",
        payload: cart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: "No se encontró el cart con id" + req.params.cid,
    });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await ServiceCart.createCart();
    res.status(200).json({
      status: "Success",
      msg: "Se creó un nuevo carrito",
      payload: newCart
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: "Hubo un error al crear el carrito",
    });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    await ServiceCart.addProductToCart(req.params.cid, req.params.pid);
    res.status(200).json({
      status: "Success",
      msg: `Se agrego el producto con id: ${req.params.pid} al carrito: ${req.params.cid}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: `No se logró agregar el producto ${req.params.cid} al carrito ${req.params.pid}`,
    });
  }
});
