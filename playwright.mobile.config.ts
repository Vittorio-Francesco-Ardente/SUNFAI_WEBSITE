import { defineConfig, devices } from "@playwright/test";

/**
 * Mobile matrix for SUN-FAI. Runs against the static export (what GitHub Pages serves).
 *   npm run build && npm run test:mobile
 * Set MOBILE_FULL=1 for the full route list (nightly / before release).
 */
export default defineConfig({
  testDir: "./tests/mobile",
  outputDir: "./reports/mobile/artifacts",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "reports/mobile/html", open: "never" }]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  use: {
    baseURL: "http://localhost:4173",
    contextOptions: { reducedMotion: "reduce" }, // deterministic screenshots; motion is tested separately
    locale: "it-IT",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx serve out -l 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "iphone-se-320", use: { ...devices["iPhone SE"] } }, // 320 × 568, WebKit
    { name: "iphone-se-375", use: { ...devices["iPhone 15"], viewport: { width: 375, height: 667 } } },
    { name: "iphone-15", use: { ...devices["iPhone 15"] } }, // 393 × 659
    { name: "pixel-7", use: { ...devices["Pixel 7"] } }, // 412 × 839, Chromium
    { name: "galaxy-s9", use: { ...devices["Galaxy S9+"] } }, // 320 × 658, Chromium
    { name: "iphone-15-landscape", use: { ...devices["iPhone 15 landscape"] } }, // 734 × 343
    { name: "ipad-mini", use: { ...devices["iPad Mini"] } }, // 768 × 1024
  ],
});
