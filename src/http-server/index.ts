import crypto from "crypto";
import express from "express";
import path from "path";

import ApiRoutes from "./routes/api";
import DashboardRoutes from "./routes/dashboard";
import DashboardApiRoutes from "./routes/dashboard-api";
import LoginRoute from "./routes/login";

import {
  checkHashFromHeaders,
  checkLocalHash,
  generateLocalHash,
} from "../utils/hash";

// Mainside an app (Load save database and check hash, ... ETC.)
export const Run = async () => {
  const app = express();
  const port = 3000;

  app.use("/api", ApiRoutes);

  app.use("/api-admin", DashboardApiRoutes);

  app.use("/login", LoginRoute);

  app.use("/", DashboardRoutes);
  // Define the path to the _cdn directory
  const cdnPath = path.join(__dirname, "public", "cdn");

  // Use express.static middleware to serve static files from _cdn
  app.use("/_cdn", express.static(cdnPath));

  await loadState();

  app.listen(port, () => {
    clog(`App started on ${port}`);
  });
};

async function loadState() {
  clog("Load starting");
  if (!checkLocalHash()) generateLocalHash();
  clog("Load ended");
}
