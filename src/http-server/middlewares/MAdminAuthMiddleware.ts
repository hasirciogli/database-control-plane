import express from "express";
import { PlaneDB } from "../../plane-db";

const MAdminAuthMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies["admin-auth"] ?? null;

  if (!token) {
    return res.redirect("/login");
  }

  if (Array.isArray(token)) {
    return res.redirect("/login");
  }

  var resolvedToken = Buffer.from(token, "base64").toString("utf-8"); // Decode işlemi

  const [username, password] = resolvedToken.split(":");

  if (!username || !password) return res.redirect("/login");

  const user = PlaneDB.getUsers().find(
    (user) => user.username === username && user.password === password
  );

  if (!user) return res.redirect("/login");

  next();
};

export default MAdminAuthMiddleware;
