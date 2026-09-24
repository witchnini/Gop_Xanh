import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: fileURLToPath(new URL("./code/front end/public", import.meta.url)),
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./code/front end/src", import.meta.url)),
      "@backend": fileURLToPath(new URL("./code/backend/src", import.meta.url)),
    },
  },
  plugins: [
    tanstackStart({
      srcDirectory: "code/front end/src",
      server: { entry: "server" },
    }),
    nitro({
      publicAssets: [
        {
          dir: fileURLToPath(new URL("./code/front end/public", import.meta.url)),
          baseURL: "/",
          maxAge: 0,
        },
      ],
    }),
    tailwindcss(),
    viteReact(),
  ],
});
