import passport from "passport";
import { UserModel } from "../DAO/mongo/models/user.model.js";
import CustomError from "../services/errors/custom-error.js";
import EErrors from "../services/errors/enums.js";

export const renderLogin = (req, res) => {
  return res.render("login", {});
};

export const login = passport.authenticate("login", {
  failureRedirect: "/auth/faillogin",
});

export const renderRegister = (req, res) => {
  return res.render("register", {});
};

export const register = passport.authenticate("register", {
  failureRedirect: "/auth/failregister",
});

export const getPerfil = async (req, res) => {
  const userId = req.query.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    CustomError.createError({
      name: "User not found",
      cause: "User not found",
      message: "User not found",
      code: EErrors.USER_NOT_FOUND,
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: err.message, msg: "Error al cerrar sesión" });
    }
    return res.redirect("/auth/login");
  });
};

export const redirectProfile = (req, res) => {
  try {
    if (req.session.role) {
      return res.redirect("/perfil");
    } else {
      return res.redirect("/notUser");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
