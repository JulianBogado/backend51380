import express from "express";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { homeRouter } from "./routes/home.router.js";
import { realTimeProducts } from "./routes/realTimeProducts.router.js";
import { __dirname, connectMongo } from "./utils.js";
import handlebars from "express-handlebars";
import path from "path";
import { initServerSockets } from "./sockets.js";
import { chatRouter } from "./routes/chat.router.js";
import { productsView } from "./routes/productsView.router.js";
import { cartView } from "./routes/cartView.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { authRouter } from "./routes/auth.router.js";
import { esAdmin, isUser, userButNotAdmin } from "./services/auth.services.js";
import passport from "passport";
import { iniPassport } from "./config/passport.config.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import errorHandler from "./middlewares/error.js";
import { mockingRouter } from "./routes/mocking.router.js";
import { addLogger, logger } from "./middlewares/logger.js";
import { loggerRouter } from "./routes/logger.router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(port, () => {
  logger.info(`App listening on ${port} http://localhost:${port}`);
});

connectMongo();
initServerSockets(httpServer);

//Swagger

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",

    info: {
      title: "Documentación de e-commerce",

      description: "Documentación del proyecto e-commerce para CoderHouse",
    },
  },

  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(addLogger);
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, ttl: 3600 }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Init Passport

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//API's Views

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Render Views

/* app.use("/home", homeRouter); */

app.use("/api/sessions", sessionsRouter);
app.use("/realtimeproducts", realTimeProducts);
app.use("/chat", userButNotAdmin, chatRouter);
app.use("/products", userButNotAdmin, productsView);
app.use("/carts", cartView);
app.use("/auth", authRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/loggerTest", loggerRouter);
app.use(errorHandler);
/* app.get("/", (req, res) => {
  res.status(200).send("Entrega websockets");
}); */

app.get("/*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "No se encuentra la ruta" });
});
