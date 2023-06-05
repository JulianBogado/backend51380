import { Server } from "socket.io";
import { productManager } from "./routes/realTimeProducts.router.js";
import { ChatModel } from "./DAO/models/messages.model.js";

export const initServerSockets = (httpServer) => {
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
    socketServer.on('connection', (socket) => {
      socket.on('msg_front_to_back', async (msg) => {
        const msgCreated = await ChatModel.create(msg);
        const msgs = await ChatModel.find({});
        socketServer.emit('msg_back_to_front', msgs);
      });
    });
  })
};
