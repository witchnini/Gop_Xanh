// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  vite: {
    publicDir: "code/front end/public",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./code/front end/src", import.meta.url)),
        "@backend": fileURLToPath(new URL("./code/backend/src", import.meta.url)),
      },
    },
  },
  tanstackStart: {
    srcDirectory: "code/front end/src",
    // Use the application's SSR error wrapper.
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
