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
exports.Run = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./routes/api"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const dashboard_api_1 = __importDefault(require("./routes/dashboard-api"));
const login_1 = __importDefault(require("./routes/login"));
const hash_1 = require("../utils/hash");
// Mainside an app (Load save database and check hash, ... ETC.)
const Run = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = 3000;
    app.use("/api", api_1.default);
    app.use("/api-admin", dashboard_api_1.default);
    app.use("/login", login_1.default);
    app.use("/", dashboard_1.default);
    // Define the path to the _cdn directory
    const cdnPath = path_1.default.join(__dirname, "public", "cdn");
    // Use express.static middleware to serve static files from _cdn
    app.use("/_cdn", express_1.default.static(cdnPath));
    yield loadState();
    app.listen(port, () => {
        clog(`App started on ${port}`);
    });
});
exports.Run = Run;
function loadState() {
    return __awaiter(this, void 0, void 0, function* () {
        clog("Load starting");
        if (!(0, hash_1.checkLocalHash)())
            (0, hash_1.generateLocalHash)();
        clog("Load ended");
    });
}
