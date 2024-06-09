import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import mysql from "mysql2";
import * as database from "../../plane-db";
import { listAccounts } from "./../../utils/database";
import { HCreateDatabase } from "./../handlers/HdatabaseHandlers";

const router = express.Router();

interface Server {
  id: string;
  endpoint: string;
  port: number;
  user: string;
  pass: string;
}

interface Database {
  data: {
    servers?: Server[];
  };
}

const db: Database = {
  data: database.default.getInstance("Database.json").data as any,
};

router.get("/", (req: Request, res: Response) => {
  res.json({
    status: true,
    servers: db.data.servers ?? [],
  });
});

const check = (servers: Server[], newId: string): boolean => {
  return servers.some((server) => server.id === newId);
};

router.post("/", (req, res) => HCreateDatabase(req,res))

router.get("/:serverId", (req: Request, res: Response) => {
  const server = db.data.servers?.find(
    (server) => server.id === req.params.serverId
  );

  if (!server) {
    return res.json({
      status: false,
      message: "Server not found.",
    });
  }

  return res.json({
    status: true,
    server,
  });
});

router.delete("/:serverId", (req: Request, res: Response) => {
  db.data.servers =
    db.data.servers?.filter((server) => server.id !== req.params.serverId) ??
    [];

  return res.json({
    status: true,
  });
});

router.put("/:serverId", (req: Request, res: Response) => {
  db.data.servers =
    db.data.servers?.map((server) => {
      if (server.id === req.params.serverId) {
        return {
          id: server.id,
          ...req.body.data,
        };
      } else return server;
    }) ?? [];

  res.json({
    status: true,
  });
});

// Accounts state
router.get("/:serverId/accounts", async (req: Request, res: Response) => {
  const server = db.data.servers?.find(
    (server) => server.id === req.params.serverId
  );

  if (!server) {
    return res.json({
      status: false,
      message: "Server not found.",
    });
  }

  try {
    const connection = await mysql.createConnection({
      host: server.endpoint,
      port: server.port,
      user: server.user,
      password: server.pass,
      connectTimeout: 3000,
    });

    const rows = await connection.execute(
      "SELECT User as user, Host as host FROM mysql.user"
    );
    await connection.end();

    return res.json({
      status: true,
      accounts: rows,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Connection Error",
    });
  }
});

router.post("/:serverId/accounts", async (req: Request, res: Response) => {
  const server = db.data.servers?.find(
    (server) => server.id === req.params.serverId
  );

  if (!server) {
    return res.json({
      status: false,
      message: "Server not found.",
    });
  }

  const accounts: any = await listAccounts({
    host: server.endpoint,
    port: server.port,
    user: server.user,
    pass: server.pass,
  });

  if (accounts) {
    const exists = accounts.filter(
      (acc: any) => acc.user === req.body.user && acc.host === req.body.host
    );
    if (exists) {
      return res.json({
        status: false,
        message: "Account already exists.",
      });
    }
  }

  return res.json({
    status: false,
    message: "Invalid error.",
  });
});

router.get("/:serverId/health-check", async (req: Request, res: Response) => {
  const server = db.data.servers?.find(
    (server) => server.id === req.params.serverId
  );

  if (!server) {
    return res.json({
      status: false,
      message: "Server not found.",
    });
  }

  try {
    const connection = await mysql.createConnection({
      host: server.endpoint,
      port: server.port,
      user: server.user,
      password: server.pass,
      connectTimeout: 3000,
    });

    await connection.end();

    return res.json({
      status: true,
      health: "Running",
    });
  } catch (error) {
    return res.json({
      status: false,
      health: "Down",
    });
  }
});

export default router;
