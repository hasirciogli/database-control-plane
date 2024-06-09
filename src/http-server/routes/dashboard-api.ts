import express from "express";
import ebas from "express-basic-auth";
import { PlaneDB } from "../../plane-db";
import MAdminAuthMiddleware from "../middlewares/MAdminAuthMiddleware";
import cookieParser from "cookie-parser";
import {
  HCreateDatabase,
  HDeleteDatabase,
  HInspectDatabase,
  HUpdateDatabase,
} from "../handlers/HdatabaseHandlers";

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use(MAdminAuthMiddleware);

// Serve UI
router.get("/databases", (req, res) => {
  return res.json({
    status: true,
    servers: PlaneDB.data.servers ?? [],
  });
});

router.post("/databases", (req, res) => HCreateDatabase(req, res));

router.get("/databases/:id", (req, res) => HInspectDatabase(req, res));
router.put("/databases/:id", (req, res) => HUpdateDatabase(req, res));
router.delete("/databases/:id", (req, res) => HDeleteDatabase(req, res));

export default router;
