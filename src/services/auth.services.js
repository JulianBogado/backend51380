export const isUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};

export const esAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admin only." });
};

export const userButNotAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. User only." });
}
