import express from "express";
import ebas from "express-basic-auth";
import { PlaneDB } from "../../plane-db";
import MAdminAuthMiddleware from "../middlewares/MAdminAuthMiddleware";
import cookieParser from "cookie-parser";

const router = express.Router();

router.use(cookieParser())
router.use(MAdminAuthMiddleware);

router.get("/cdn/scripts/main", (req, res) => {
  res.sendFile("main.js", { root: __dirname + "/../public/scripts" });
});
 
// Serve UI
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/../public" });
});

export default router;
