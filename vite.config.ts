import { defineConfig } from "vite";

export default defineConfig({
  base: "/speedcube/",
  build: {
    target: "esnext",
  },
  worker: {
    format: "es",
  },
});
