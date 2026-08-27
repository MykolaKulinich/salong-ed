import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Matches tsconfig.json's "@/*" -> "./src/*" path mapping.
      "@": path.resolve(rootDir, "src"),
      // See src/test/server-only-stub.ts for why.
      "server-only": path.resolve(rootDir, "src/test/server-only-stub.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
