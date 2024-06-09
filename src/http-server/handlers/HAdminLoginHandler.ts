import { Request, Response } from "express";
import { IDatabase } from "../interfaces/IDatabase";
import { connectionTest } from "../../utils/database";
import { PlaneDB } from "../../plane-db";

export const HAdminLoginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return false;

  const user = PlaneDB.getUsers().find(
    (user) => user.username === username && user.password === password
  );

  if (!user) return false;

  res.cookie("admin-auth", Buffer.from(`${username}:${password}`).toString("base64"));

  return true;
};
