"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneDB = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Database {
    constructor(filename) {
        this.data = {};
        this.filename = filename;
        this.load();
        this.registerThread();
        this.handleExit();
    }
    static getInstance(filename) {
        if (!Database.instance) {
            Database.instance = new Database(filename);
        }
        return Database.instance;
    }
    load() {
        const filePath = path_1.default.join(__dirname, "../../data", this.filename);
        try {
            if (!fs_1.default.existsSync(filePath)) {
                // Dosya yoksa boş bir JSON dosyası oluştur
                fs_1.default.writeFileSync(filePath, "{}", "utf-8");
                clog("Database file created.", "LOCAL DB");
            }
            const fileData = fs_1.default.readFileSync(filePath, "utf-8");
            Object.assign(this.data, JSON.parse(fileData));
            clog("Database loaded.", "LOCAL DB");
        }
        catch (err) {
            clog("Error loading database:" + err, "LOCAL DB");
        }
    }
    save() {
        const filePath = path_1.default.join(__dirname, "../../data", this.filename);
        try {
            const jsonData = JSON.stringify(this.data, null, 2);
            fs_1.default.writeFileSync(filePath, jsonData, "utf-8");
            clog("Database saved.", "LOCAL DB");
        }
        catch (err) {
            clog("Error saving database:" + err, "LOCAL DB");
        }
    }
    registerThread() {
        setInterval(() => {
            this.save();
        }, 25000);
    }
    addUser(user) {
        if (!this.data.users) {
            this.data.users = [];
        }
        // check if user exists via username
        if (this.data.users.find((u) => u.username === user.username)) {
            clog("User already exists.", "LOCAL DB");
            return;
        }
        this.data.users.push(user);
        this.save();
    }
    getUsers() {
        return this.data.users || [];
    }
    // Uygulama kapatıldığında veritabanını kaydet
    handleExit() {
        process.on("exit", () => {
            this.save();
        });
        // Kapatma işlemi bekleniyor
        process.on("SIGINT", () => {
            clog("Exiting...", "LOCAL DB");
            process.exit(0);
        });
    }
}
exports.PlaneDB = Database.getInstance("Database.json");
exports.default = Database;
