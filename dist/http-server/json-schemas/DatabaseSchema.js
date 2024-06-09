"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "object",
    properties: {
        name: { type: "string" },
        port: { type: "number" },
        user: { type: "string" },
        pass: { type: "string" },
        host: { type: "string" },
        type: { type: "string" },
    },
    required: ["user", "pass", "host", "port", "name", "type"],
};
