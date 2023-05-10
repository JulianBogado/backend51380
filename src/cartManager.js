import { error } from "console";
import fs from "fs";

export default class CartManager {
  carts = [];
  lastId = 0;
  constructor(path) {
    this.path = path;
  }

  async loadCarts(filename) {
    try {
      const data = await fs.promises.readFile(filename || this.path, "utf-8");

      if (data.length >= 0) {
        this.carts = JSON.parse(data);
      } else {
        console.log("El archivo está vacío");
      }
      return this.carts
    } catch (error) {
      console.log("Hubo un error al cargar el archivo");
      console.log(error);
    }
  }
  async saveDataCart() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log("Hubo un error al guardar el archivo ", error);
    }
  }
  async createCart() {
    try {
      await this.loadCarts();
      if (this.carts.length > 0) {
        const maxIdCart = this.carts.reduce((prev, current) => {
          return prev.id > current.id ? prev : current;
        });

        this.lastId = maxIdCart.id;
      } else {
        this.lastId = 0;
      }
      const newCart = {
        id: ++this.lastId,
        products: [],
      };
      this.carts.push(newCart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
      return newCart;
    } catch (error) {
      console.log("Hubo un error al generar el carrito ", error);
    }
  }
  async addProductCart(cid, pid) {
    const carts = await this.loadCarts();
    const findCart = carts.findIndex((cart) => cart.id === parseInt(cid));
    try {
      if (findCart === -1) {
        console.log(`No se encuentra el carrito con id ${cid}`);
      } else {
        const findProduct = carts[findCart].products.findIndex(
          (product) => product.id === pid
        );

        if (findProduct === -1) {
          carts[findCart].products.push({
            id: pid,
            quantity: 1,
          });
        } else {
          carts[findCart].products[findProduct].quantity += 1;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      }
    } catch (error) {
      console.log("Hubo un error al agregar el producto ", error);
    }
  }

  async getCartById(cid) {
    try {
      await this.loadCarts();
      const cart =
        this.carts.length > 0
          ? this.carts.find((cart) => cart.id === parseInt(cid))
          : null;
      if (cart) {
        return cart;
      } else {
        console.log(`Producto con código ${cid} no encontrado`);
        return null;
      }
    } catch (error) {
      console.log(
        `Hubo un error al mostrar el producto con id ${cid}, error: ${error}`
      );
    }
  }
}
