import express from "express";

const loggerRouter = express.Router();

loggerRouter.get("/", (req, res) => {
    req.logger.debug("Esto es un mensaje de debug");
    req.logger.http("Esto es un mensaje de http");
    req.logger.info("Esto es un mensaje de info");
    req.logger.warn("Esto es un mensaje de warning");
    req.logger.error("Esto es un mensaje de error");
    req.logger.fatal("Esto es un mensaje de fatal");
    res.send("Logs generados en consola y archivo.");
    }
);

export { loggerRouter };