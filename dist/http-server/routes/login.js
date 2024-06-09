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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const HAdminLoginHandler_1 = require("../handlers/HAdminLoginHandler");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use((0, cookie_parser_1.default)());
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile("login.html", { root: __dirname + "/../public" });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            status: false,
            message: "Invalid request.",
        });
    }
    if (!(yield (0, HAdminLoginHandler_1.HAdminLoginHandler)(req, res))) {
        return res.json({
            status: false,
            message: "Invalid credentials.",
        });
    }
    return res.json({
        status: true,
        message: "Logged in.",
    });
}));
exports.default = router;
