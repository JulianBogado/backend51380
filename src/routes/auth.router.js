import express from "express";
import { isUser, esAdmin } from "../services/auth.services.js";
import { UserModel } from "../DAO/mongo/models/user.model.js";
import passport from "passport";
import UserDTO from "../DAO/DTO/users.dto.js";

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
    async (req, res, next) => {
      try {
        // Crear una nueva instancia de UserDTO utilizando el cuerpo de la solicitud (req.body)
        const userDTO = new UserDTO(req.body);
  
        // Validar los datos utilizando el método validate del UserDTO
        const { error } = userDTO.validate();
  
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
  
        // Si la validación pasa, crear un nuevo usuario utilizando Passport
        passport.authenticate("register", (err, user, info) => {
          if (err) {
            return next(err);
          }
  
          if (!user) {
            return res.status(400).json({ error: "El usuario ya existe" });
          }
  
          // Si el registro es exitoso, almacenar la información del usuario en la sesión
          req.session.user = {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            role: user.role,
          };
  
          return res.json({ msg: "ok", payload: userDTO });
        })(req, res, next); // Pasar el req, res y next a la función passport.authenticate
      } catch (error) {
        return next(error);
      }
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