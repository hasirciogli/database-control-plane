import express, { Request, Response } from "express";
import { checkHashFromHeaders } from "../../utils/hash";
import serversRouter from "./../namespaces/database-servers";

const router = express.Router();

router.use(express.json());

router.use((req, res, next) => {
  if (!checkHashFromHeaders(req))
    return res.status(401).json({
      status: false,
      message: "Authentication required.",
    });

  next();
});

router.get("/health-check", (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Software running",
    time: Date.now().toLocaleString("tr-TR"),
  });
});

// load routes from namespaces
router.use("/database-servers", serversRouter);

export default router;
