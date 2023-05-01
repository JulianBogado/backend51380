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
      console.log(error)
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
  async addProduct(title, description, price, thumbnail, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !stock) {
        console.log("Debe llenar todos los campos para agregar el producto");
      } else {
        const product = {
          price: price,
          description: description,
          title: title,
          thumbnail: thumbnail,
          code: ++this.lastId,
          stock: stock,
        };
        this.products.push(product);
        this.saveData();
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
        returns(product);
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
  async updateProduct(code, field, value) {
    try {
      await this.loadData();

      const product = this.products.find((item) => item.code === code);

      if (product) {
        product[field] = value;
        await this.saveData();
        this.loadData();
        console.log(`Producto con id ${code} actualizado`);
      } else {
        console.log(`No se encontró el producto con id ${code}`);
      }
    } catch (error) {
      console.log(
        `Hubo un error al actualizar el producto con id ${code}, error: ${error}`
      );
    }
  }
  async deleteProduct(code) {
    try {
      await this.loadData();

      const product = this.products.find((item) => item.code === code);

      if (product) {
        this.products.splice(code - 1, 1);
        console.log(`Se eliminó el producto con code ${code}`);
        await this.saveData();
      } else {
        console.log(`No se encontró el producto con code ${code}` );
      }
    } catch (error) {
      console.log("Hubo un error al eliminar el producto", error);
    }
  }
}

const nuevoProducto = new ProductManager("data.json");

