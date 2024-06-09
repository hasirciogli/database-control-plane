// src/global.d.ts
export {};

declare global {
  function clog(
    log: string,
    title: string | null = null,
    color: string | null = null
  ): void;
}
