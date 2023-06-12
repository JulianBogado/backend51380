import { CartModel } from "../DAO/models/carts.model.js";
import { ProductModel } from "../DAO/models/products.model.js";

export class CartService {
  async getCartById(_id) {
    const cart = await CartModel.find({ _id: _id });
    return cart;
  }
  async createCart() {
  const cart = await CartModel.findOne({ _id: _id });
  return cart;
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

  async addProductToCart(cid, pid) {
    const product = await ProductModel.findOne({ _id: pid });
    const cart = await CartModel.findOne({ _id: cid });

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === pid
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
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartModel.findOne({ _id: cid });

      const productIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );

      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return;
      }

      cart.products.splice(productIndex, 1);
      await cart.save();

      console.log("Producto eliminado del carrito");
    } catch (error) {
      console.log("Error al eliminar el producto del carrito:", error);
    }
  }
  async updateCart(cid, productIds) {
    try {
      const cart = await CartModel.findOne({ _id: cid });
      if (cart) {
        const existingProductIds = cart.products.map((item) =>
          item.product.toString()
        );

        // Filtrar los IDs de productos que ya existen en el carrito
        const newProductIds = productIds.filter(
          (id) => !existingProductIds.includes(id)
        );

        const productsToAdd = await ProductModel.find({
          _id: { $in: newProductIds },
        });

        // Verificar que los productos existan antes de agregarlos al carrito
        const validProducts = productsToAdd.filter(
          (product) => product !== null
        );
        if (validProducts.length !== newProductIds.length) {
          console.log("Algunos productos no existen");
          return;
        }

        // Incrementar la cantidad de productos existentes en el carrito
        for (const existingProduct of cart.products) {
          if (productIds.includes(existingProduct.product.toString())) {
            existingProduct.quantity += 1;
          }
        }

        // Agregar los nuevos productos al carrito
        const newProducts = validProducts.map((product) => ({
          product: product._id,
          quantity: 1, // Puedes ajustar la cantidad según tus necesidades
        }));
        cart.products.push(...newProducts);

        await cart.save();
        return cart.products;
      } else {
        console.log("No existe el carrito indicado");
      }
    } catch (error) {
      console.log("Error al actualizar el carrito:", error);
    }
  }

  async updateProductFromCart(cid, pid, updatedQuantity) {
    try {
      const cart = await CartModel.findOne({ _id: cid });

      const productIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );
      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito");
        return;
      }

      const product = await ProductModel.findOne({ _id: pid });
      if (!product) {
        console.log("El producto no existe");
        return;
      }

      if (updatedQuantity <= 0) {
        console.log("La cantidad debe ser mayor que cero");
        return;
      }

      if (updatedQuantity > product.stock) {
        console.log("No hay suficiente stock del producto");
        return;
      }

      cart.products[productIndex].quantity = updatedQuantity.quantity;
      await cart.save();

      console.log("Producto actualizado en el carrito");
    } catch (error) {
      console.log("Error al actualizar el producto en el carrito:", error);
    }
  }
  async emptyCart(cid) {
    try {
      const result = await CartModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );
      return result;
    } catch (error) {
      console.log("Error al vaciar el carrito: ", error);
    }
  }
}
