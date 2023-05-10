import { error } from "console";
import fs from "fs";

export default class ProductManager {
  products = [];
  lastId = 0;
  constructor(path) {
    this.path = path;
  }

  async loadData(filename) {
    try {
      const data = await fs.promises.readFile(filename || this.path, "utf-8");

      if (data.length >= 0) {
        this.products = JSON.parse(data);
      } else {
        console.log("El archivo está vacío");
      }
    } catch (error) {
      console.log("Hubo un error al cargar el archivo");
      console.log(error);
    }
  }
  async saveData() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log("Hubo un error al guardar el archivo ", error);
    }
  }
  async addProduct(inputData = {}) {
    const { title, description, price, thumbnail, stock } = inputData;
    try {
      if (!title || !description || !price || !stock) {
        console.log(
          `Debe llenar todos los campos para agregar el producto. Falta el campo ${
            !title
              ? "title"
              : !description
              ? "description"
              : !price
              ? "price"
              : "stock"
          }`
        );
      } else {
        const products = await this.loadData("./src/data.json");

        if (this.products.length > 0) {
          const maxCodeProduct = this.products.reduce((prev, current) => {
            return prev.code > current.code ? prev : current;
          });

          this.lastId = maxCodeProduct.code;
        }

        const product = {
          price: price,
          description: description,
          title: title,
          thumbnail: thumbnail,
          code: ++this.lastId,
          stock: stock,
        };

        this.products.push(product);
        await this.saveData();
      }
    } catch (error) {
      console.log("Hubo un error al agregar el producto ", error);
    }
  }
  async getProducts() {
    try {
      await this.loadData();
      return this.products;
    } catch (error) {
      console.log("Hubo un error al mostrar los productos ", error);
    }
  }
  async getProductById(code) {
    try {
      await this.loadData();
      const product =
        this.products.length > 0
          ? this.products.find((item) => item.code === parseInt(code))
          : null;
      if (product) {
        return product;
      } else {
        console.log(`Producto con código ${code} no encontrado`);
        return null;
      }
    } catch (error) {
      console.log(
        `Hubo un error al mostrar el producto con id ${code}, error: ${error}`
      );
    }
  }
  async updateProduct(code, updatedFields = {}) {
    const { title, description, price, thumbnail, stock } = updatedFields;

    try {
      await this.loadData();
      const productCode = parseInt(code);
      const product = this.products.find((item) => item.code === productCode);

      if (product) {
        if (productCode !== product.code) {
          throw new Error("No se puede actualizar el ID del producto");
        }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.thumbnail = thumbnail ?? product.thumbnail;
        product.stock = stock ?? product.stock;

        await this.saveData();
        await this.loadData();

        console.log(`Producto con id ${productCode} actualizado`);
      } else {
        console.log(`No se encontró el producto con id ${productCode}`);
      }
    } catch (error) {
      console.log(
        `Hubo un error al actualizar el producto con id ${productCode}, error: ${error}`
      );
      console.log(error);
    }
  }
  async deleteProduct(code) {
    try {
      await this.loadData();
      const productCode = parseInt(code);

      const product = this.products.find((item) => item.code === productCode);

      if (product) {
        this.products.splice(productCode - 1, 1);
        console.log(`Se eliminó el producto con code ${productCode}`);
        await this.saveData();
      } else {
        console.log(`No se encontró el producto con code ${productCode}`);
      }
    } catch (error) {
      console.log("Hubo un error al eliminar el producto", error);
    }
  }
}
