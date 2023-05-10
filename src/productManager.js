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
    const { title, description, price, thumbnail, stock, category, code } = inputData;
    try {
      if (!title || !code || !description || !price || !stock) {
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
          const maxIdProduct = this.products.reduce((prev, current) => {
            return prev.id > current.id ? prev : current;
          });

          this.lastId = maxIdProduct.id;
        }

        const product = {
          status: true,
          code: code,
          price: price,
          description: description,
          title: title,
          thumbnail: thumbnail,
          id: ++this.lastId,
          category: category,
          stock: stock,
        };

        this.products.push(product);
        await this.saveData();
        return product;
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
  async getProductById(id) {
    try {
      await this.loadData();
      const product =
        this.products.length > 0
          ? this.products.find((item) => item.id === parseInt(id))
          : null;
      if (product) {
        return product;
      } else {
        console.log(`Producto con código ${id} no encontrado`);
      }
    } catch (error) {
      console.log(
        `Hubo un error al mostrar el producto con id ${id}, error: ${error}`
      );
    }
  }
  async updateProduct(id, updatedFields = {}) {
    const { title, description, price, thumbnail, stock, code, category } = updatedFields;

    try {
      await this.loadData();
      const productId = parseInt(id);
      const product = this.products.find((item) => item.id === productId);

      if (product) {
        if (productId !== product.id) {
          throw new Error("No se puede actualizar el ID del producto");
        }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.thumbnail = thumbnail ?? product.thumbnail;
        product.stock = stock ?? product.stock;
        product.code = code ?? product.code;
        product.category = category ?? product.category;

        await this.saveData();
        await this.loadData();

        console.log(`Producto con id ${productId} actualizado`);
      } else {
        console.log(`No se encontró el producto con id ${productId}`);
      }
    } catch (error) {
      console.log(
        `Hubo un error al actualizar el producto con id ${productId}, error: ${error}`
      );
      console.log(error);
    }
  }
  async deleteProduct(id) {
    try {
      await this.loadData();
      const productId = parseInt(id);

      const product = this.products.find((item) => item.id === productId);

      if (product) {
        this.products.splice(productId - 1, 1);
        console.log(`Se eliminó el producto con id ${productId}`);
        await this.saveData();
      } else {
        console.log(`No se encontró el producto con id ${productId}`);
      }
    } catch (error) {
      console.log("Hubo un error al eliminar el producto", error);
    }
  }
}
