import express from "express";
import { isUser, esAdmin } from "../middlewares/auth.js";
import { UserModel } from "../DAO/models/user.model.js";

export const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  return res.render("login", {});
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Faltan credenciales" });
  }
  const usuarioEncontrado = await UserModel.findOne({ email: email });
  if (usuarioEncontrado && usuarioEncontrado.password === password) {
    req.session.email = usuarioEncontrado.email;
    req.session.isAdmin = usuarioEncontrado.isAdmin;
    return res.redirect(`/auth/perfil?userId=${usuarioEncontrado._id}`);
  } else {
    return res.status(401).send({ error: "Usuario o contraseña incorrecta" });
  }
});

authRouter.get("/register", (req, res) => {
  return res.render("register");
});

authRouter.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const isAdmin = false; // Establecemos el valor de isAdmin como false

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await UserModel.create({ email, password, firstName, lastName, isAdmin });
    req.session.email = email;
    req.session.isAdmin = isAdmin;
    return res.redirect("/auth/perfil");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
});

authRouter.get("/perfil", isUser, esAdmin, async (req, res) => {
    const userId = req.query.userId;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.render("perfil", { user: user.toObject() });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: err.message, msg: "Error al cerrar sesión" });
    }
    return res.redirect("/auth/login");
  });
});

//Validar si es admin y usuario, y en caso afirmativo redirigirlo a /perfil. De lo contrario redirigirlo a /notUser
authRouter.get("/perfil", isUser, esAdmin, async (req, res) => {
  try {
    if (req.session.isAdmin) {
      return res.redirect("/perfil");
    } else {
      return res.redirect("/notUser");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
