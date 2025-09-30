// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/seoul": {
        target: "http://openapi.seoul.go.kr:8088",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/seoul/, ""),
      },
    },
  },
});
