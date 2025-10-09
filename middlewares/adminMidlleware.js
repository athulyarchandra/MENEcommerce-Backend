import users from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await users.findById(req.session.user);
  if (user && user.role === "admin") {
    req.user = { id: user._id, role: user.role };
    return next();
  }
  res.status(403).json({ error: "Access denied. Admins only." });
};
