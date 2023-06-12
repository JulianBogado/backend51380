import { ProductService } from "../services/products.services.js";
import express from "express";
import { getProductPaginationOptions } from "../utils.js";

export const productsView = express.Router();

const productService = new ProductService();

productsView.get("/", async (req, res) => {
  try {
    const paginationOptions = getProductPaginationOptions(req.query);
    const { products, response, pagination } = await productService.getAllProducts(paginationOptions);

    return res.render("productsView", { response, products, pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
});
