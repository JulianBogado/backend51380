import fs from "fs";
import path from "path";
import { __dirname } from "../../utils.js";


const CARTS_FILE_PATH = path.join(__dirname, "./data/carts.json");

export default class Carts {
  async getCartById(_id) {
    try {
      const carts = await this.getAllCartsFromFile();
      return carts.find((cart) => cart._id === _id) || null;
    } catch (error) {
      console.log("Error al obtener el carrito:", error);
      return null;
    }
  }

  async createCart() {
    try {
      const newCart = {
        _id: this.generateId(),
        products: [],
      };
      const carts = await this.getAllCartsFromFile();
      carts.push(newCart);
      await this.saveCartsToFile(carts);
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getAllCartsFromFile();
      const cartIndex = carts.findIndex((cart) => cart._id === cid);
      if (cartIndex === -1) {
        console.log("El carrito no existe");
        return null;
      }

      const productIndex = carts[cartIndex].products.findIndex(
        (item) => item.product === pid
      );

      if (productIndex === -1) {
        const newProduct = {
          product: pid,
          quantity: 1,
        };
        carts[cartIndex].products.push(newProduct);
      } else {
        carts[cartIndex].products[productIndex].quantity += 1;
      }

      await this.saveCartsToFile(carts);
      return carts[cartIndex];
    } catch (error) {
      console.log("Error al agregar el producto al carrito:", error);
      return null;
    }
  }

  async updateProductFromCart(cid, pid, updatedQuantity) {
    try {
      const carts = await this.getAllCartsFromFile();
      const cartIndex = carts.findIndex((cart) => cart._id === cid);
      if (cartIndex === -1) {
        console.log("El carrito no existe");
        return null;
      }

      const productIndex = carts[cartIndex].products.findIndex(
        (item) => item.product === pid
      );
      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return null;
      }

      if (updatedQuantity <= 0) {
        console.log("La cantidad debe ser mayor que cero");
        return null;
      }

      carts[cartIndex].products[productIndex].quantity = updatedQuantity;
      await this.saveCartsToFile(carts);
      return carts[cartIndex];
    } catch (error) {
      console.log("Error al actualizar el producto en el carrito:", error);
      return null;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const carts = await this.getAllCartsFromFile();
      const cartIndex = carts.findIndex((cart) => cart._id === cid);
      if (cartIndex === -1) {
        console.log("El carrito no existe");
        return null;
      }

      const productIndex = carts[cartIndex].products.findIndex(
        (item) => item.product === pid
      );
      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return null;
      }

      carts[cartIndex].products.splice(productIndex, 1);
      await this.saveCartsToFile(carts);
      return carts[cartIndex];
    } catch (error) {
      console.log("Error al eliminar el producto del carrito:", error);
      return null;
    }
  }

  async emptyCart(cid) {
    try {
      const carts = await this.getAllCartsFromFile();
      const cartIndex = carts.findIndex((cart) => cart._id === cid);
      if (cartIndex === -1) {
        console.log("El carrito no existe");
        return null;
      }

      carts[cartIndex].products = [];
      await this.saveCartsToFile(carts);
      return carts[cartIndex];
    } catch (error) {
      console.log("Error al vaciar el carrito:", error);
      return null;
    }
  }

  async getAllCartsFromFile() {
    try {
      const data = await fs.promises.readFile(CARTS_FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCartsToFile(carts) {
    try {
      await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.log("Error al guardar los carritos:", error);
    }
  }

  generateId() {

    return Math.random().toString(36).substr(2, 9);
  }
}
