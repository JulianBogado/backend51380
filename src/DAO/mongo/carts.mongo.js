import { CartModel } from "./models/carts.model.js";
import { ProductModel } from "../models/products.model.js";

export default class Carts {
  constructor() {}
  getCartById = async (_id) => {
    try {
      return await CartModel.findById(_id).populate("products.product");
    } catch (error) {
      console.log("Error al obtener el carrito:", error);
      return null;
    }
  };

  createCart = async () => {
    try {
      const newCart = await CartModel.create({});
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      return null;
    }
  };


  updateProductFromCart = async (cid, pid, updatedQuantity) => {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        console.log("El carrito no existe");
        return null;
      }

      const productIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );
      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return null;
      }

      const product = await ProductModel.findById(pid);
      if (!product) {
        console.log("El producto no existe");
        return null;
      }

      if (updatedQuantity <= 0) {
        console.log("La cantidad debe ser mayor que cero");
        return null;
      }

      if (updatedQuantity > product.stock) {
        console.log("No hay suficiente stock del producto");
        return null;
      }

      cart.products[productIndex].quantity = updatedQuantity;
      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error al actualizar el producto en el carrito:", error);
      return null;
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        console.log("El carrito no existe");
        return null;
      }

      const productIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );
      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return null;
      }

      cart.products.splice(productIndex, 1);
      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error al eliminar el producto del carrito:", error);
      return null;
    }
  };

  emptyCart = async (cid) => {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        console.log("El carrito no existe");
        return null;
      }

      cart.products = [];
      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error al vaciar el carrito:", error);
      return null;
    }
  };
}
