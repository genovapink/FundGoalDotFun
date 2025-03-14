import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  minify: !options.watch,
  entry: ["src/index.ts"],
  splitting: false,
  clean: true,
  onSuccess: options.watch ? "node dist" : undefined,
}));
