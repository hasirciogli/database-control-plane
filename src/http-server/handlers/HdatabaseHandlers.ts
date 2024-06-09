import { Request, Response } from "express";
import { IDatabase } from "../interfaces/IDatabase";
import { connectionTest } from "../../utils/database";
import { PlaneDB } from "../../plane-db";
import { Validator as JsonValidator } from "jsonschema";

import DatabaseSchema from "../json-schemas/DatabaseSchema";

export const HCreateDatabase = async (req: Request, res: Response) => {
  try {
    const { name, type, host, port, user, pass } = req.body;

    const db: IDatabase = {
      id: crypto.randomUUID(),
      name,
      type,
      host,
      port: parseInt(port),
      user,
      pass,
    };

    var result = new JsonValidator().validate(db, DatabaseSchema as object);

    if (result.errors.length) {
      return res.json({
        status: false,
        aaaa: req.body,
        errors: result.errors,
        message: "Invalid request.",
      });
    }

    const isConnected = await connectionTest(db);
    if (!isConnected) {
      return res.json({
        status: false,
        message: "Connection failed.",
      });
    }
    PlaneDB.data.servers = PlaneDB.data.servers ?? [];

    // check if exits
    var isExits = PlaneDB.data.servers.find(
      (server: IDatabase) =>
        server.host == db.host &&
        server.port == db.port &&
        server.user == db.user
    );

    if (isExits) {
      return res.json({
        status: false,
        message: "Database already exists.",
      });
    }

    PlaneDB.data.servers.push(db);
    PlaneDB.save();

    return res.json({
      status: true,
      message: "Database created.",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid request. 2" + error,
    });
  }
};

export const HDeleteDatabase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        status: false,
        message: "Invalid request.",
      });
    }

    PlaneDB.data.servers = PlaneDB.data.servers.filter(
      (server: IDatabase) => server.id !== id
    );

    PlaneDB.save();

    return res.json({
      status: true,
      message: "Database deleted.",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid request.",
    });
  }
};

export const HInspectDatabase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        status: false,
        message: "Invalid request.",
      });
    }

    const server = PlaneDB.data.servers?.find(
      (server: IDatabase) => server.id === id
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
      message: "Server found.",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid request.",
    });
  }
};

export const HUpdateDatabase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, host, port, user, pass } = req.body;

    const db: IDatabase = {
      id,
      name,
      type,
      host,
      port: parseInt(port),
      user,
      pass,
    };

    var result = new JsonValidator().validate(db, DatabaseSchema as object);

    if (result.errors.length) {
      return res.json({
        status: false,
        aaaa: req.body,
        errors: result.errors,
        message: "Invalid request.",
      });
    }

    const isExits = PlaneDB.data.servers.find((_: IDatabase) => {
      return _.id === id;
    });

    if (!isExits) {
      return res.json({
        status: false,
        message: "Database not found.",
      });
    }

    const isConnected = await connectionTest(db);
    if (!isConnected) {
      return res.json({
        status: false,
        message: "Connection failed.",
      });
    }

    PlaneDB.data.servers = PlaneDB.data.servers.map(
      (_: IDatabase, index: number) => {
        if (_.id === id) {
          return db;
        }
        return _;
      }
    );
    PlaneDB.save();

    return res.json({
      status: true,
      message: "Database updated.",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Error Occurred.",
    });
  }
};
