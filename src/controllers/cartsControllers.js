import CartService from "../services/cart.services.js";
import UserDTO from "../DAO/DTO/users.dto.js";
import TicketService from "../services/ticket.services.js";

const ServiceCart = new CartService();
const ServiceTicket = new TicketService();


export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtén el parámetro 'cid' de la solicitud
    const cart = await ServiceCart.getCartById(cartId); // Pasa el parámetro 'cid' al servicio
    if (cart) {
      res.status(200).json({
        status: "Success",
        msg: "Cart encontrado",
        payload: cart,
      });
    } else {
      res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con ID: ${cartId}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      msg: "Hubo un error al obtener el carrito",
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await ServiceCart.createCart();
    res.status(200).json({
      status: "Success",
      msg: "Se creó un nuevo carrito",
      payload: newCart,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: "Hubo un error al crear el carrito",
    });
  }
};

export const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const prodId = req.params.pid;
  try {
    await ServiceCart.addProductToCart(cartId, prodId);
    res.status(200).json({
      status: "Success",
      msg: `Se agrego el producto con id: ${req.params.pid} al carrito: ${req.params.cid}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: `No se logró agregar el producto ${req.params.cid} al carrito ${req.params.pid}`,
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    await ServiceCart.deleteProductFromCart(req.params.cid, req.params.pid);
    return res.status(200).json({
      status: "Success",
      msg: `Se eliminó el producto con ID: ${req.params.pid} del carrito ${req.params.cid}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: `No se pudo eliminar el producto ${req.params.pid} del carrito ${req.params.cid}`,
    });
  }
};

export const emptyCart = async (req, res) => {
  try {
    await ServiceCart.emptyCart(req.params.cid);
    return res.status(200).json({
      status: "Succes",
      msg: `Se vació el carrito ${req.params.cid}`,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      msg: `No se logró vaciar el carrito`,
    });
  }
};

export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    await ServiceCart.updateCart(cid, products);
    return res.status(200).json({
      status: "Success",
      msg: `Se agregaron los productos ${products}`,
    });
  } catch (error) {
    console.log("Error al actualizar el carrito:", error);
    return res.status(400).json({
      status: "Error",
      msg: "No se logró actualizar el carrito",
    });
  }
};

export const updateProductFromCart = async (req, res) => {
  const updatedQuantity = req.body;
  try {
    await ServiceCart.updateProductFromCart(
      req.params.cid,
      req.params.pid,
      updatedQuantity
    );
    return res.status(200).json({
      status: "Succes",
      msg: "Se logró actualizar el cart " + req.params.cid,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      msg: "No se logró actualizar el cart " + req.params.cid,
    });
  }
};


