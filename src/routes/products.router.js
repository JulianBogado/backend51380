import express from "express";
import ProductManager from "../productManager.js";

const productManager = new ProductManager("./src/data.json");

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();
    console.log(productos);

    if (limit) {
      res.status(200).json({
        status: "Success",
        msg: "Listado de Productos",
        payload: productos.slice(0, limit),
      });
    } else {
      res.status(200).json(productos);
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

productsRouter.post("/", async (req, res) => {
  const detail = req.body;
  try {
    const product = await productManager.addProduct(detail);
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
    const producto = await productManager.getProductById(req.params.pid);
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
    const producto = await productManager.getProductById(id);
    if (producto) {
      await productManager.updateProduct(id, updatedFields);
      res.status(200).json({
        status: "Success",
        msg: "Producto actualizado exitosamente",
        payload: {...producto},
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
    const producto = await productManager.getProductById(id);
    if (producto) {
      await productManager.deleteProduct(id);
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
