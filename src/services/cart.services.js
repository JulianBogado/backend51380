import { CartModel } from "../DAO/models/carts.model.js";
import { ProductModel } from "../DAO/models/products.model.js";

export class CartService {
  async getCartById(_id) {
    const cart = await CartModel.find({ _id: _id });
    return cart;
  }
  async createCart() {
    const newCart = await CartModel.create({});
    return newCart;
  }
  async addProductCart(cid, pid) {
    try {
      const addedProduct = await CartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      return addedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart (cid, pid) {
    const product = await ProductModel.findOne({ _id: pid })
    const cart = await CartModel.findOne({ _id: cid })

    const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid)

    if (productIndex === -1) {
      if (product.stock === 0) console.log("No hay stock del producto indicado")
      cart.products.push({ product: product._id })
      return await cart.save()
    }

    if (product.stock < cart.products[productIndex].quantity + 1) console.log("No hay stock del producto indicado")
    cart.products[productIndex].quantity += 1
    return await cart.save()
  }
}
