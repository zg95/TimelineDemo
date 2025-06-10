import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { mars3dPlugin } from "vite-plugin-mars3d";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), mars3dPlugin()],
  server: {
    port: 6789,
  },
});
