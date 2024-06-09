"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plane_db_1 = require("../../plane-db");
const MAdminAuthMiddleware_1 = __importDefault(require("../middlewares/MAdminAuthMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const HdatabaseHandlers_1 = require("../handlers/HdatabaseHandlers");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use((0, cookie_parser_1.default)());
router.use(MAdminAuthMiddleware_1.default);
// Serve UI
router.get("/databases", (req, res) => {
    var _a;
    return res.json({
        status: true,
        servers: (_a = plane_db_1.PlaneDB.data.servers) !== null && _a !== void 0 ? _a : [],
    });
});
router.post("/databases", (req, res) => (0, HdatabaseHandlers_1.HCreateDatabase)(req, res));
router.get("/databases/:id", (req, res) => (0, HdatabaseHandlers_1.HInspectDatabase)(req, res));
router.put("/databases/:id", (req, res) => (0, HdatabaseHandlers_1.HUpdateDatabase)(req, res));
router.delete("/databases/:id", (req, res) => (0, HdatabaseHandlers_1.HDeleteDatabase)(req, res));
exports.default = router;
