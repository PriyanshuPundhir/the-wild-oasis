import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      emitWarning: true,
      emitError: true,
      failOnWarning: false, // ⬅️ don't fail build on warnings
      failOnError: true, // ⬅️ fail only on actual errors
    }),
  ],
});
