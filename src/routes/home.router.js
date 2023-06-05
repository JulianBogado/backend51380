import express from "express";
import ProductManager from "../DAO/productManager.js";


const productManager = new ProductManager("./src/data.json");

export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
    try {
      const productos = await productManager.getProducts();
      return res.render("home", {productos});
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "Error",
        msg: "Error al cargar la página",
        error: error,
      });
    }
  });