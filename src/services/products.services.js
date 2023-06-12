import { ProductModel } from "../DAO/models/products.model.js";
export class ProductService {
  validateProduct(title, code, description, price, stock) {
    if ((!title, !code, !description, !price, !stock)) {
      console.log(`Error. Por favor complete los campos requeridos`);
      throw new Error("Por favor, valide los campos faltantes");
    }
  }

    async getAllProducts(options) {
    const { limit, page, sort } = options;

    const filter = {};
    const paginationOptions = {
      limit: limit,
      page: page,
      sort: sort,
    };

    try {
      const queryResult = await ProductModel.paginate(filter, paginationOptions);
      const { docs, ...pagination } = queryResult;
      const products = docs.map((doc) => ({
        title: doc.title,
        price: doc.price,
        description: doc.description,
        stock: doc.stock,
        category: doc.category,
        _id: doc._id,
      }));

      const response = {
        status: "Success",
        payload: products,
        totalPages: pagination.totalPages,
        prevPage: pagination.prevPage,
        nextPage: pagination.nextPage,
        page: pagination.page,
        hasPrevPage: pagination.hasPrevPage,
        hasNextPage: pagination.hasNextPage,
        prevLink: pagination.hasPrevPage ? `/products?page=${pagination.prevPage}` : null,
        nextLink: pagination.hasNextPage ? `/products?page=${pagination.nextPage}` : null,
      };

      return { products, response, pagination };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los productos");
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
