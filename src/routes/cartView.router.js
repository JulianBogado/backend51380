import express from "express";
import CartService from "../services/cart.services.js";
import * as cartsViewController from "../controllers/cartsView.controller.js";
export const cartView = express.Router();

const serviceCart = new CartService();

cartView.get("/:cid", cartsViewController.getCartById);

cartView.put('/:cid/purchase',  cartsViewController.purchaseCart);

cartView.get('/purchase/:cid',  cartsViewController.getTicketById);
