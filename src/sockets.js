import { Server } from "socket.io";
import { productManager } from "./routes/realTimeProducts.router.js";


export  const  initServerSockets = (httpServer) => {
  const socketServer = new Server(httpServer);
  socketServer.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.on("product:create", async (data) => {
      const product = await productManager.addProduct(data);
      socketServer.emit("product:created", product);
    });

    socket.on("product:delete", async (id) => {
      await productManager.deleteProduct(id);
      socketServer.emit("product:deleted", id);
    });
  });

  return socketServer;
};
