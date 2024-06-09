import express from "express";
import cookieParser from "cookie-parser";
import { HAdminLoginHandler } from "../handlers/HAdminLoginHandler";
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/", async (req, res) => {
  return res.sendFile("login.html", { root: __dirname + "/../public" });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      status: false,
      message: "Invalid request.",
    });
  }

  if (!(await HAdminLoginHandler(req, res))) {
    return res.json({
      status: false,
      message: "Invalid credentials.",
    });
  }

  return res.json({
    status: true,
    message: "Logged in.",
  });
});

export default router;
