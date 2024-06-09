"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plane_db_1 = require("../../plane-db");
const MAdminAuthMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies["admin-auth"]) !== null && _a !== void 0 ? _a : null;
    if (!token) {
        return res.redirect("/login");
    }
    if (Array.isArray(token)) {
        return res.redirect("/login");
    }
    var resolvedToken = Buffer.from(token, "base64").toString("utf-8"); // Decode işlemi
    const [username, password] = resolvedToken.split(":");
    if (!username || !password)
        return res.redirect("/login");
    const user = plane_db_1.PlaneDB.getUsers().find((user) => user.username === username && user.password === password);
    if (!user)
        return res.redirect("/login");
    next();
};
exports.default = MAdminAuthMiddleware;
