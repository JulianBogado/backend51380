import express from "express";
import CartManager from "../cartManager.js";

const cartManager = new CartManager("./src/carts.json");

export const cartsRouter = express.Router();

cartsRouter.get("/:cid", async(req, res) =>{
    try{
        const cart = await cartManager.getCartById(req.params.cid);
        if (cart) {
            res.status(200).json({
                status: "Success",
                msg: "Cart encontrado",
                payload: cart 
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "Error",
            msg: "No se encontró el cart " + cart,
        })
    }
});


cartsRouter.post("/", async (req, res) => {
    try {
      cartManager.createCart();
      res.status(200).json({
        status: "Success",
        msg: "Se creó un nuevo carrito",
      });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "Error",
            msg: "Hubo un error al crear el carrito"})
    }
  });

cartsRouter.post("/:cid/product/:pid", async (req, res) =>{
    try{
       await cartManager.addProductCart(req.params.cid, req.params.pid)
        res.status(200).json({
            status: "Success",
            msg: `Se agrego el producto con id: ${req.params.pid} al carrito: ${req.params.cid}`
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "Error",
            msg: "",

        })
    }
});