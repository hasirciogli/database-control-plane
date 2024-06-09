"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.clog = (log, title = null, color = null) => {
    console.log((title ? "[" + title + "] - " : "[DCP] - ") + log);
};
