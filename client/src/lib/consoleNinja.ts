export const consoleNinja = {
  info(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.info(`[ConsoleNinja] ${message}`, meta ?? "");
  },
  warn(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.warn(`[ConsoleNinja] ${message}`, meta ?? "");
  },
  error(message: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[ConsoleNinja] ${message}`, meta ?? "");
  }
};
