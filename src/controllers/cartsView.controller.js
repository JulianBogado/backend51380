import CartService from "../services/cart.services.js";
import TicketService from "../services/ticket.services.js";

const ServiceTicket = new TicketService();

const ServiceCart = new CartService();

export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtén el parámetro 'cid' de la solicitud
    const cart = await ServiceCart.getCartById(cartId); // Pasa el parámetro 'cid' al servicio
    if (cart) {
        console.log(cart   )
      return res.render("cartView", cart );
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

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const cartList = req.body;
  const dataBuyer = "correo";

  try {
    const { status, result } = await ServiceTicket.purchaseCart(cid, cartList,dataBuyer);

    if (status === 200) {
        return res.status(status).json(result);

    } else {
      return res.status(status).json(result);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", msg: "Internal Server Error", payload: {} });
  }
};

export const getTicketById = async (req, res) => {
  const { cid } = req.params;

  try {
    const ticket = await ServiceTicket.getTicketById(cid);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: "error", error: "Ticket not found." });
    }
    return res.status(200).json({ status: "success", payload: ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", msg: "Internal Server Error", payload: {} });
  }
};
