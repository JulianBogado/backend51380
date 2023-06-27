import express from "express";
import { CartService } from "../services/cart.services.js";

export const cartView = express.Router();

const serviceCart = new CartService();

cartView.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await serviceCart.getCartById(cid);

    res.render("cartView", cart[0].toObject());
    console.log(cart[0]);
  } catch (error) {
    console.error("Error al obtener el carrito de compras:", error);
    res.status(500).send("Error al obtener el carrito de compras");
  }
});
