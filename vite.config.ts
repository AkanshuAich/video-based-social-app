import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "client",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src')
    },
  },
  server: {
    host: true,
    port: 3002,
  },
});
