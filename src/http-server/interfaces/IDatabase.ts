import { EDatabaseTypes } from "../enums/EDatabaseTypes";

export interface IDatabase {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  user: string;
  pass: string;
}
