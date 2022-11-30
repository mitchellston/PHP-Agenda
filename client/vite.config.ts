import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  base: "/basis_js_php/php_crud/",
  resolve: {
    alias: {
      "@": "JSPHP/CRUD",
    },
  },
});
