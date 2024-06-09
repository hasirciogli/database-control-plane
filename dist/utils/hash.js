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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHashFromHeaders = exports.generateLocalHash = exports.checkLocalHash = exports.calculateLocalHash = void 0;
const faker_1 = require("@faker-js/faker");
const database = __importStar(require("../plane-db"));
const crypto_1 = __importDefault(require("crypto"));
const calculateLocalHash = () => {
    var _a;
    const db = database.default.getInstance("Database.json").data;
    const hash = crypto_1.default.createHash("sha256");
    const authKeys = (_a = db === null || db === void 0 ? void 0 : db.authKeys) !== null && _a !== void 0 ? _a : null;
    if (!authKeys) {
        clog("Auth key's are not initialized", "Error");
        return null;
    }
    const hashBase = authKeys.authKey + authKeys.hashes.join("");
    hash.update(hashBase);
    const digest = hash.digest("base64");
    return digest;
};
exports.calculateLocalHash = calculateLocalHash;
const checkLocalHash = () => {
    var _a;
    const db = database.default.getInstance("Database.json").data;
    const authKeys = (_a = db === null || db === void 0 ? void 0 : db.authKeys) !== null && _a !== void 0 ? _a : null;
    return authKeys !== null;
};
exports.checkLocalHash = checkLocalHash;
const generateLocalHash = () => {
    const db = database.default.getInstance("Database.json").data;
    const hashes = [];
    for (let i = 0; i < crypto_1.default.randomInt(4, 12); i++) {
        hashes.push(faker_1.fakerEN_US.person.firstName().toLowerCase() +
            faker_1.fakerEN_US.person.lastName().toLowerCase());
    }
    db.authKeys = {
        authKey: crypto_1.default.randomUUID(),
        salt: faker_1.fakerEN_US.internet.url(),
        hashes,
    };
    clog("Local hash generated", "Info");
};
exports.generateLocalHash = generateLocalHash;
const checkHashFromHeaders = (req) => {
    var _a;
    const requestedHash = (_a = req.headers["x-auth-key"]) !== null && _a !== void 0 ? _a : null;
    if (!requestedHash) {
        return false;
    }
    const localHash = (0, exports.calculateLocalHash)();
    if (!localHash) {
        return false;
    }
    return localHash === requestedHash;
};
exports.checkHashFromHeaders = checkHashFromHeaders;
