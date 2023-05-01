import express from "express";
import ProductManager from "./productManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

const productManager = new ProductManager("data.json");

app.get("/", (req, res) => {
  res.status(200).send("Desafio 3!");
});

app.get("/productos", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();
    console.log(productos);

    if (limit) {
      res.status(200).json(productos.slice(0, limit));
    } else {
      res.status(200).json(productos);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error al obtener los productos");
  }
});

app.get("/productos/:pid", async (req, res) => {
  try {
    const producto = await productManager.getProductById(req.params.pid);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json("Producto no encontrado");

    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error al obtener el producto");
  }
});

app.listen(port, () => {
  console.log(`App listening on ${port} http://localhost:${port}`);
});
