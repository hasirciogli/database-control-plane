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
exports.connectionTest = exports.getAccountAssociatedDatabases = exports.createAccount = exports.listAccounts = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const listAccounts = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, user, pass } = db;
    var con = mysql2_1.default.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass,
    });
    try {
        var isConnected = yield new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no();
                }
                let sql = `SELECT User as user, Host as host FROM mysql.user`;
                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no();
                        return;
                    }
                    yes(res);
                });
            });
        });
    }
    catch (error) { }
    return isConnected ? isConnected : null;
});
exports.listAccounts = listAccounts;
const createAccount = (db, nu) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, user, pass } = db;
    const { newUser, newHost, newPass } = nu;
    var con = mysql2_1.default.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass,
    });
    try {
        var isConnected = yield new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no(null);
                }
                // Belirtilen bilgiler ile boş bir veritabanı kullanıcısı oluşturur
                let sql = `CREATE USER '${newUser}'.'${newHost} IDENTIFIED BY '${newPass}''`;
                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no(null);
                        return;
                    }
                    yes(res);
                });
            });
        });
    }
    catch (error) { }
    return isConnected ? isConnected : null;
});
exports.createAccount = createAccount;
const getAccountAssociatedDatabases = (db, adu) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, user, pass } = db;
    const { checkUser, checkHost } = adu;
    var con = mysql2_1.default.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass,
    });
    try {
        var isConnected = yield new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no(null);
                }
                // Belirtilen bilgiler ile boş bir veritabanı kullanıcısı oluşturur
                let sql = `SHOW GRANTS FOR '${checkUser}'.'${checkHost}'`;
                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no(null);
                        return;
                    }
                    yes(res);
                });
            });
        });
    }
    catch (error) { }
    return isConnected ? isConnected : null;
});
exports.getAccountAssociatedDatabases = getAccountAssociatedDatabases;
const connectionTest = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, user, pass } = db;
    var con = mysql2_1.default.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass,
    });
    try {
        var isConnected = yield new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no(null);
                }
                yes(true);
            });
        });
    }
    catch (error) { }
    return isConnected ? isConnected : null;
});
exports.connectionTest = connectionTest;
