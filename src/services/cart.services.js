import Carts from "../DAO/mongo/carts.mongo.js";
//import Carts from "../DAO/memory/carts.memory.js";
import { CartModel } from "../DAO/mongo/models/carts.model.js";
import { ProductModel } from "../DAO/models/products.model.js";

export default class CartService {
  constructor() {
    this.carts = new Carts();
  }

  async getCartById(_id) {
    try {
      const result = await this.carts.getCartById(_id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(req, res) {
    try {
      const result = await this.carts.createCart();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  addProductToCart = async (cartId, prodId) => {
    const product = await ProductModel.findOne({ _id: prodId });
    const cart = await CartModel.findOne({ _id: cartId });

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === prodId
    );

    if (productIndex === -1) {
      if (product.stock === 0)
        console.log("No hay stock del producto indicado");
      cart.products.push({ product: product._id });
      return await cart.save();
    }

    if (product.stock < cart.products[productIndex].quantity + 1)
      console.log("No hay stock del producto indicado");
    cart.products[productIndex].quantity += 1;
    return await cart.save();
  }

  async updateProductFromCart(cid, pid, products) {
    try {
      const result = await this.carts.updateProductFromCart(cid, pid, products);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const result = await this.carts.deleteProductFromCart(cid, pid);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async emptyCart(cid) {
    try {
      const result = await this.carts.emptyCart(cid);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
