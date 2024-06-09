"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hash_1 = require("../../utils/hash");
const database_servers_1 = __importDefault(require("./../namespaces/database-servers"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use((req, res, next) => {
    if (!(0, hash_1.checkHashFromHeaders)(req))
        return res.status(401).json({
            status: false,
            message: "Authentication required.",
        });
    next();
});
router.get("/health-check", (req, res) => {
    res.json({
        status: true,
        message: "Software running",
        time: Date.now().toLocaleString("tr-TR"),
    });
});
// load routes from namespaces
router.use("/database-servers", database_servers_1.default);
exports.default = router;
