import { ProductModel } from "../DAO/models/products.model.js";


export class ProductService {
  validateProduct(title, code, description, price, stock) {
    if ((!title, !code, !description, !price, !stock)) {
      console.log(`Error. Por favor complete los campos requeridos`);
      throw new Error("Por favor, valide los campos faltantes");
    }
  }
  async addProduct(detail) {
    const { title, code, description, price, stock } = detail;
    this.validateProduct(title, code, description, price, stock);
    const createdProduct = await ProductModel.create(detail);
    return createdProduct;
  }
  async getProducts() {
    const products = await ProductModel.find({});
    return products;
  }
  async getProductById(_id) {
    const product = await ProductModel.find({ _id: _id });
    return product;
  }
  async updateProduct(_id, updatedFields) {
    if (!_id) throw new Error("invalid _id");
    const { title, code, description, price, stock } = updatedFields;
    this.validateProduct(title, code, description, price, stock);
    const productUpdated = await ProductModel.updateOne(
      { _id: _id },
      { $set: updatedFields }
    );
    return productUpdated;
  }
  async deleteProduct(_id) {
    const deleted = await ProductModel.deleteOne({ _id: _id });
    return deleted;
  }
}
