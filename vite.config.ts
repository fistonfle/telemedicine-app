/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // "/api": "http://localhost:8088",
       "/api": "http://138.68.67.245:8088",
    },
  },
});
