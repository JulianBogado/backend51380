import express from "express";
import { isUser, esAdmin } from "../middlewares/auth.js";
import { UserModel } from "../DAO/models/user.model.js";
import passport from "passport";

export const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  return res.render("login", {});
});

authRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: "invalid credentials" });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
    };

    return res.json({ msg: "ok", payload: req.user });
  }
);

authRouter.get("/register", (req, res) => {
  return res.render("register", {});
});

authRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/auth/failregister" }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: "something went wrong" });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: req.user.role,
    };

    return res.json({ msg: "ok", payload: req.user });
  }
);

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
    if (req.session.role) {
      return res.redirect("/perfil");
    } else {
      return res.redirect("/notUser");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
