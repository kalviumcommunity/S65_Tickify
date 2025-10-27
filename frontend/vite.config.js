import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const target =
  process.env.NODE_ENV === "production"
    ? process.env.VITE_BASE_URI_PROD
    : process.env.VITE_BASE_URI_DEV;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
