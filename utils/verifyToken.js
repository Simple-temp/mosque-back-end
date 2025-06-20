import jwt from "jsonwebtoken";
const JWT_SECRET = "your_jwt_secret";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Now you have user info: { id, role, name, ... }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
