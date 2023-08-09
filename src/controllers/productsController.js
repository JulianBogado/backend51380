import CustomError from "../services/errors/custom-error.js";
import EErrors from "../services/errors/enums.js";
import { ProductService } from "../services/products.services.js";

const productService = new ProductService();

export const getProducts = async (req, res) => {
  // Agregar el limit por query limit = req.query.limit;
  const productos = await productService.getProducts();
  if (productos) {
    res.status(200).json(productos);
  } else {
    CustomError.createError({
      name: "Error al obtener los productos",
      cause: "Failed to catch products from database",
      message: "Hubo un error al obtener los productos, intentelo mas tarde",
      code: EErrors.DATABASE_ERROR,
    });
  }
};

export const addProduct = async (req, res) => {
  const detail = req.body;
  const product = await productService.addProduct(detail);
  if (product) {
    res.status(201).json({
      status: "Success",
      msg: "Se agregó un nuevo producto",
      payload: { ...product },
    });
  } else {
    CustomError.createError({
      name: "Error al agregar el producto",
      cause: "Failed to add product to database",
      message: "Hubo un error al agregar el producto, intentelo mas tarde",
      code: EErrors.DATABASE_ERROR,
    });
  }
};

export const getProductById = async (req, res) => {
  const producto = await productService.getProductById(req.params.pid);
  if (producto) {
    res.status(200).json({
      status: "Success",
      msg: "Se encontro el producto",
      payload: producto,
    });
  } else {
    CustomError.createError({
      name: "Error al obtener el producto",
      cause: "Failed to catch product from database",
      message: "Hubo un error al obtener el producto, intentelo mas tarde",
      code: EErrors.DATABASE_ERROR,
    });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.pid;
  const updatedFields = req.body;

  try {
    const producto = await productService.getProductById(id);
    if (producto) {
      await productService.updateProduct(id, updatedFields);
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
};

export const deleteProduct = async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productService.getProductById(id);
    if (producto) {
      await productService.deleteProduct(id);
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
};
