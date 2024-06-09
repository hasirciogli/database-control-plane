#!/usr/bin/env node
import "./../utils/log";

import { calculateLocalHash, generateLocalHash } from "../utils/hash";
import * as httpServer from "./../http-server/index";
import { PlaneDB } from "../plane-db";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "auth-string":
    clog("Auth string is generated.");
    clog("Auth string: " + calculateLocalHash());
    process.exit(0);
    break;
  case "start-http-server":
    httpServer.Run();
    break;
  case "generate-local-hash":
    generateLocalHash();
    process.exit(0);
    break;

  case "make:user":
    PlaneDB.addUser({
      username: args[1],
      password: args[2],
    });
    PlaneDB.save();
    process.exit(0);
    break;
  case "update:user":
    PlaneDB.data.users = PlaneDB.data.users?.map((user) => {
      if (user.username === args[1]) {
        user.password = args[2];
      }
      return user;
    });
    process.exit(0);
    break;
  default:
    clog("Invalid command.");
    process.exit(0);
    break;
}
