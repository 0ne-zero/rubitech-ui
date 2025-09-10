import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  base: "/rubitech-ui/", // or "/" for <username>.github.io
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } }
});
