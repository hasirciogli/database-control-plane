"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mysql2_1 = __importDefault(require("mysql2"));
const database = __importStar(require("../../plane-db"));
const database_1 = require("./../../utils/database");
const HdatabaseHandlers_1 = require("./../handlers/HdatabaseHandlers");
const router = express_1.default.Router();
const db = {
    data: database.default.getInstance("Database.json").data,
};
router.get("/", (req, res) => {
    var _a;
    res.json({
        status: true,
        servers: (_a = db.data.servers) !== null && _a !== void 0 ? _a : [],
    });
});
const check = (servers, newId) => {
    return servers.some((server) => server.id === newId);
};
router.post("/", (req, res) => (0, HdatabaseHandlers_1.HCreateDatabase)(req, res));
router.get("/:serverId", (req, res) => {
    var _a;
    const server = (_a = db.data.servers) === null || _a === void 0 ? void 0 : _a.find((server) => server.id === req.params.serverId);
    if (!server) {
        return res.json({
            status: false,
            message: "Server not found.",
        });
    }
    return res.json({
        status: true,
        server,
    });
});
router.delete("/:serverId", (req, res) => {
    var _a, _b;
    db.data.servers =
        (_b = (_a = db.data.servers) === null || _a === void 0 ? void 0 : _a.filter((server) => server.id !== req.params.serverId)) !== null && _b !== void 0 ? _b : [];
    return res.json({
        status: true,
    });
});
router.put("/:serverId", (req, res) => {
    var _a, _b;
    db.data.servers =
        (_b = (_a = db.data.servers) === null || _a === void 0 ? void 0 : _a.map((server) => {
            if (server.id === req.params.serverId) {
                return Object.assign({ id: server.id }, req.body.data);
            }
            else
                return server;
        })) !== null && _b !== void 0 ? _b : [];
    res.json({
        status: true,
    });
});
// Accounts state
router.get("/:serverId/accounts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const server = (_a = db.data.servers) === null || _a === void 0 ? void 0 : _a.find((server) => server.id === req.params.serverId);
    if (!server) {
        return res.json({
            status: false,
            message: "Server not found.",
        });
    }
    try {
        const connection = yield mysql2_1.default.createConnection({
            host: server.endpoint,
            port: server.port,
            user: server.user,
            password: server.pass,
            connectTimeout: 3000,
        });
        const rows = yield connection.execute("SELECT User as user, Host as host FROM mysql.user");
        yield connection.end();
        return res.json({
            status: true,
            accounts: rows,
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: "Connection Error",
        });
    }
}));
router.post("/:serverId/accounts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const server = (_b = db.data.servers) === null || _b === void 0 ? void 0 : _b.find((server) => server.id === req.params.serverId);
    if (!server) {
        return res.json({
            status: false,
            message: "Server not found.",
        });
    }
    const accounts = yield (0, database_1.listAccounts)({
        host: server.endpoint,
        port: server.port,
        user: server.user,
        pass: server.pass,
    });
    if (accounts) {
        const exists = accounts.filter((acc) => acc.user === req.body.user && acc.host === req.body.host);
        if (exists) {
            return res.json({
                status: false,
                message: "Account already exists.",
            });
        }
    }
    return res.json({
        status: false,
        message: "Invalid error.",
    });
}));
router.get("/:serverId/health-check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const server = (_c = db.data.servers) === null || _c === void 0 ? void 0 : _c.find((server) => server.id === req.params.serverId);
    if (!server) {
        return res.json({
            status: false,
            message: "Server not found.",
        });
    }
    try {
        const connection = yield mysql2_1.default.createConnection({
            host: server.endpoint,
            port: server.port,
            user: server.user,
            password: server.pass,
            connectTimeout: 3000,
        });
        yield connection.end();
        return res.json({
            status: true,
            health: "Running",
        });
    }
    catch (error) {
        return res.json({
            status: false,
            health: "Down",
        });
    }
}));
exports.default = router;
