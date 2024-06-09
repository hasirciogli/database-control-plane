"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MAdminAuthMiddleware_1 = __importDefault(require("../middlewares/MAdminAuthMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router = express_1.default.Router();
router.use((0, cookie_parser_1.default)());
router.use(MAdminAuthMiddleware_1.default);
router.get("/cdn/scripts/main", (req, res) => {
    res.sendFile("main.js", { root: __dirname + "/../public/scripts" });
});
// Serve UI
router.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/../public" });
});
exports.default = router;
