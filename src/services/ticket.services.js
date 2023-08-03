import { TicketModel } from "../DAO/models/tickets.model.js";
import { ProductService } from "./products.services.js";
import CartService from "./cart.services.js";

const Service = new ProductService();

const Cart = new CartService();

export default class TicketService {
  async purchaseCart(cartId, dataBuyer) {
    try {
      // Verificar si el carrito existe
      const cart = await Cart.getCartById(cartId);
      if (!cart) {
        return {
          status: 404,
          result: {
            status: "error",
            error: "Cart not found.",
          },
        };
      }

      const productsInCart = [];

      for (const item of cart.products) {
        const product = await Service.getProductById(item.product._id);

        if (!product || item.product.stock < item.quantity) {
          continue;
        }

        const updatedStock = item.product.stock - item.quantity;

        if (updatedStock < 0) {
          console.log(
            "Error. No hay suficiente stock para realizar la compra."
          );
          continue;
        }

        // Agregar el producto al proceso de compra
        productsInCart.push({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        });

        // Actualizar el stock solo si hay suficiente cantidad
        await Service.updateProduct(item.product._id, {
          stock: updatedStock,
          title: product.title,
          price: product.price,
          description: product.description,
          code: product.code,
        });
      }

      // Crear un nuevo ticket con los productos comprados
      const newOrder = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: 0,
        purchaser: "dataBuyer",
        products: productsInCart.map((product) => ({
          id: product.productId,
          quantity: product.quantity,
        })),
      };

      // Calcular el total de la compra
      newOrder.amount = productsInCart.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      const orderCreated = await TicketModel.create(newOrder);

      // Filtrar los productos que no pudieron comprarse
      const productsNotPurchased = cart.products.filter((item) => {
        const product = Service.getProductById(item.product._id);
        return (
          !productsInCart.find((p) => p.productId === item.product._id) ||
          item.quantity > product.stock
        );
      });

      return {
        status: 200,
        result: {
          status: "success",
          payload: { ticket: orderCreated, productsNotPurchased },
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async getTicketById(cid) {
    try {
      const ticket = await TicketModel.getTicketById(cid);
      if (!ticket) {
        return console.log("Ticket not found.");
      }
      return res.render("ticket", { ticket });
    } catch (error) {
      console.error(error);
    }
  }
}
