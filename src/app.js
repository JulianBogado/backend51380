import express from "express";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { homeRouter } from "./routes/home.router.js";
import { realTimeProducts } from "./routes/realTimeProducts.router.js"
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { initServerSockets } from "./sockets.js";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(port, () => {
  console.log(`App listening on ${port} http://localhost:${port}`);
});

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

//API's Views

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Render Views

app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeProducts);

app.get("/", (req, res) => {
  res.status(200).send("Entrega websockets");
});

app.get("/*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "No se encuentra la ruta" });
});

initServerSockets(httpServer);