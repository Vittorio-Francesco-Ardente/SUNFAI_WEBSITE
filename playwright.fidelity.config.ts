import { defineConfig, devices } from "@playwright/test";

/**
 * Concept fidelity (QA checklist §B): screenshots at the concepts' canvas sizes, composed side by side with the
 * approved concept into reports/fidelity/*.png for visual review.  npm run build && npm run test:fidelity
 */
export default defineConfig({
  testDir: "./tests/fidelity",
  outputDir: "./reports/fidelity/artifacts",
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    contextOptions: { reducedMotion: "reduce" },
    locale: "it-IT",
    colorScheme: "light",
  },
  webServer: { command: "npx serve out -l 4173", port: 4173, reuseExistingServer: !process.env.CI },
  projects: [{ name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } }],
});
