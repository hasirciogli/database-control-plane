"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAdminLoginHandler = void 0;
const plane_db_1 = require("../../plane-db");
const HAdminLoginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password)
        return false;
    const user = plane_db_1.PlaneDB.getUsers().find((user) => user.username === username && user.password === password);
    if (!user)
        return false;
    res.cookie("admin-auth", Buffer.from(`${username}:${password}`).toString("base64"));
    return true;
});
exports.HAdminLoginHandler = HAdminLoginHandler;
