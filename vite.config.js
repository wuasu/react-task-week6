import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  //課前:將 Vite 專案打包並部署 8:00
  base: process.env.NODE_ENV === "production" ? "/react-task-week5/" : "/",
  plugins: [react()],
});
