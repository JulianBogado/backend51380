import express from "express";

import { ProductService } from "../services/products.services.js";


export const productsRouter = express.Router();

const Service = new ProductService();

productsRouter.get("/", async (req, res) => {
  try {
    // Agregar el limit por query limit = req.query.limit;
    const productos = await Service.getProducts();
    console.log(productos);

    res.status(200).json(productos);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Failed",
      msg: "Error al obtener los productos",
      error: error,
    });
  }
});

productsRouter.post("/", async (req, res) => {
  const detail = req.body;
  try {
    const product = await Service.addProduct(detail);
    res.status(201).json({
      status: "Success",
      msg: "Se agregó un nuevo producto",
      payload: { ...product },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("No se pudo agregar el producto");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const producto = await Service.getProductById(req.params.pid);
    if (producto) {
      res.status(200).json({
        status: "Success",
        msg: "Se encontro el producto",
        payoad: producto,
      });
    } else {
      res.status(404).json("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Failed",
      msg: "Error al obtener los productos",
      error: error,
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedFields = req.body;

  try {
    const producto = await Service.getProductById(id);
    if (producto) {
      await Service.updateProduct(id, updatedFields);
      res.status(200).json({
        status: "Success",
        msg: "Producto actualizado exitosamente",
        payload: { ...producto },
      });
    } else {
      res.status(404).json("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      msg: "Error al actualizar el producto",
      error: error,
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await Service.getProductById(id);
    if (producto) {
      await Service.deleteProduct(id);
      res.status(200).json({
        status: "Success",
        msg: `Se elimino el producto con code ${id} correctamente`,
        payload: `Producto eliminado: ${producto.title}`,
      });
    } else {
      res.status(404).json("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      msg: "Error al eliminar el producto",
      error: error,
    });
  }
});
