import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React config.
// PDF.js works out of the box here because we import its worker as a URL
// inside src/utils/pdfParser.js (see that file for details).
export default defineConfig({
  plugins: [react()],
  // Relative asset paths. Required so the built app works both on Vercel
  // AND when loaded from a chrome-extension:// URL inside the extension.
  base: "./",
});
