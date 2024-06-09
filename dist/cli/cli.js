#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
require("./../utils/log");
const hash_1 = require("../utils/hash");
const httpServer = __importStar(require("./../http-server/index"));
const plane_db_1 = require("../plane-db");
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case "auth-string":
        clog("Auth string is generated.");
        clog("Auth string: " + (0, hash_1.calculateLocalHash)());
        process.exit(0);
        break;
    case "start-http-server":
        httpServer.Run();
        break;
    case "generate-local-hash":
        (0, hash_1.generateLocalHash)();
        process.exit(0);
        break;
    case "make:user":
        plane_db_1.PlaneDB.addUser({
            username: args[1],
            password: args[2],
        });
        process.exit(0);
        break;
    default:
        clog("Invalid command.");
        process.exit(0);
        break;
}
