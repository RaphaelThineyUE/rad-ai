export const ConsoleNinja = {
  info(message: string, meta?: unknown) {
    console.info(`[ConsoleNinja] ${message}`, meta ?? "");
  },
  warn(message: string, meta?: unknown) {
    console.warn(`[ConsoleNinja] ${message}`, meta ?? "");
  },
  error(message: string, meta?: unknown) {
    console.error(`[ConsoleNinja] ${message}`, meta ?? "");
  }
};
