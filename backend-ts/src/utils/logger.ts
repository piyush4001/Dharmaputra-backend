// Logger utility
// Simple logger utility

export const logger = {
  info: (message: string, data?: any) => {
    console.log(message, data || "");
  },

  error: (message: string, error?: any) => {
    console.error(message, error || "");
  },

  warn: (message: string, data?: any) => {
    console.warn(message, data || "");
  },
};
