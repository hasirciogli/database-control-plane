export {};

global.clog = (
  log: string,
  title: string | null = null,
  color: string | null = null
) => {
  console.log((title ? "[" + title + "] - " : "[DCP] - ") + log);
};
