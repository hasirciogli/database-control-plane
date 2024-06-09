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
exports.HUpdateDatabase = exports.HInspectDatabase = exports.HDeleteDatabase = exports.HCreateDatabase = void 0;
const database_1 = require("../../utils/database");
const plane_db_1 = require("../../plane-db");
const jsonschema_1 = require("jsonschema");
const DatabaseSchema_1 = __importDefault(require("../json-schemas/DatabaseSchema"));
const HCreateDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, type, host, port, user, pass } = req.body;
        const db = {
            id: crypto.randomUUID(),
            name,
            type,
            host,
            port: parseInt(port),
            user,
            pass,
        };
        var result = new jsonschema_1.Validator().validate(db, DatabaseSchema_1.default);
        if (result.errors.length) {
            return res.json({
                status: false,
                aaaa: req.body,
                errors: result.errors,
                message: "Invalid request.",
            });
        }
        const isConnected = yield (0, database_1.connectionTest)(db);
        if (!isConnected) {
            return res.json({
                status: false,
                message: "Connection failed.",
            });
        }
        plane_db_1.PlaneDB.data.servers = (_a = plane_db_1.PlaneDB.data.servers) !== null && _a !== void 0 ? _a : [];
        // check if exits
        var isExits = plane_db_1.PlaneDB.data.servers.find((server) => server.host == db.host &&
            server.port == db.port &&
            server.user == db.user);
        if (isExits) {
            return res.json({
                status: false,
                message: "Database already exists.",
            });
        }
        plane_db_1.PlaneDB.data.servers.push(db);
        plane_db_1.PlaneDB.save();
        return res.json({
            status: true,
            message: "Database created.",
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: "Invalid request. 2" + error,
        });
    }
});
exports.HCreateDatabase = HCreateDatabase;
const HDeleteDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: "Invalid request.",
            });
        }
        plane_db_1.PlaneDB.data.servers = plane_db_1.PlaneDB.data.servers.filter((server) => server.id !== id);
        plane_db_1.PlaneDB.save();
        return res.json({
            status: true,
            message: "Database deleted.",
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: "Invalid request.",
        });
    }
});
exports.HDeleteDatabase = HDeleteDatabase;
const HInspectDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: "Invalid request.",
            });
        }
        const server = (_b = plane_db_1.PlaneDB.data.servers) === null || _b === void 0 ? void 0 : _b.find((server) => server.id === id);
        if (!server) {
            return res.json({
                status: false,
                message: "Server not found.",
            });
        }
        return res.json({
            status: true,
            server,
            message: "Server found.",
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: "Invalid request.",
        });
    }
});
exports.HInspectDatabase = HInspectDatabase;
const HUpdateDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, type, host, port, user, pass } = req.body;
        const db = {
            id,
            name,
            type,
            host,
            port: parseInt(port),
            user,
            pass,
        };
        var result = new jsonschema_1.Validator().validate(db, DatabaseSchema_1.default);
        if (result.errors.length) {
            return res.json({
                status: false,
                aaaa: req.body,
                errors: result.errors,
                message: "Invalid request.",
            });
        }
        const isExits = plane_db_1.PlaneDB.data.servers.find((_) => {
            return _.id === id;
        });
        if (!isExits) {
            return res.json({
                status: false,
                message: "Database not found.",
            });
        }
        const isConnected = yield (0, database_1.connectionTest)(db);
        if (!isConnected) {
            return res.json({
                status: false,
                message: "Connection failed.",
            });
        }
        plane_db_1.PlaneDB.data.servers = plane_db_1.PlaneDB.data.servers.map((_, index) => {
            if (_.id === id) {
                return db;
            }
            return _;
        });
        plane_db_1.PlaneDB.save();
        return res.json({
            status: true,
            message: "Database updated.",
        });
    }
    catch (error) {
        return res.json({
            status: false,
            message: "Error Occurred.",
        });
    }
});
exports.HUpdateDatabase = HUpdateDatabase;
