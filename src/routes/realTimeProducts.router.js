import ProductManager from "../DAO/productManager.js";
import express from 'express';

export const productManager = new ProductManager("./src/data.json");

export const realTimeProducts = express.Router();

realTimeProducts.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("realTimeProducts", {products})
});