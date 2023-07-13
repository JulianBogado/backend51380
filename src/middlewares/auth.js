export function isUser(req, res, next) {
  if (req.session?.user.email) {
    return next();
  }
  return res.status(401).json({ error: "Error de autenticacion." });
}

export function esAdmin(req, res, next) {
  if (req.session?.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ msg: "Usted no es administrador" });
}
