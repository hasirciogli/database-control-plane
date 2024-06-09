import { fakerEN_US } from "@faker-js/faker";
import * as database from "../plane-db";
import crypto from "crypto";

interface AuthKeys {
  authKey: string;
  salt: string;
  hashes: string[];
}

export const calculateLocalHash = (): string | null => {
  const db = database.default.getInstance("Database.json").data as any;
  const hash = crypto.createHash("sha256");
  const authKeys: AuthKeys | null = db?.authKeys ?? null;

  if (!authKeys) {
    clog("Auth key's are not initialized", "Error");
    return null;
  }

  const hashBase = authKeys.authKey + authKeys.hashes.join("");
  hash.update(hashBase);
  const digest = hash.digest("base64");
  return digest;
};

export const checkLocalHash = (): boolean => {
  const db = database.default.getInstance("Database.json").data as any;
  const authKeys: AuthKeys | null = db?.authKeys ?? null;
  return authKeys !== null;
};

export const generateLocalHash = (): void => {
  const db = database.default.getInstance("Database.json").data as any;
  const hashes: string[] = [];
  for (let i = 0; i < crypto.randomInt(4, 12); i++) {
    hashes.push(
      fakerEN_US.person.firstName().toLowerCase() +
        fakerEN_US.person.lastName().toLowerCase()
    );
  }

  db.authKeys = {
    authKey: crypto.randomUUID(),
    salt: fakerEN_US.internet.url(),
    hashes,
  };

  clog("Local hash generated", "Info");
};

export const checkHashFromHeaders = (req: any): boolean => {
  const requestedHash: string | null = req.headers["x-auth-key"] ?? null;

  if (!requestedHash) {
    return false;
  }

  const localHash = calculateLocalHash();
  if (!localHash) {
    return false;
  }

  return localHash === requestedHash;
};
