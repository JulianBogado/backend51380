import express from "express";

export const chatRouter = express.Router();

chatRouter.get("/", async (req, res) => {
  try {
    return res.render("chat", {});
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: "Error al cargar la página",
      error: error,
    });
  }
});
