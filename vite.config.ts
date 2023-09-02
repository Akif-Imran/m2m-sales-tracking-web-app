import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api/index.ts"),
      "@store": path.resolve(__dirname, "./src/store/index.ts"),
      "@slices": path.resolve(__dirname, "./src/store/slices/index.ts"),
      "@thunks": path.resolve(__dirname, "./src/store/thunks/index.ts"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@markers": path.resolve(__dirname, "./src/assets/app-images/markers/index.ts"),
      "@map-markers": path.resolve(__dirname, "./src/assets/app-images/map-markers/index.ts"),
      "@components": path.resolve(__dirname, "./src/components/index.ts"),
      "@constants": path.resolve(__dirname, "./src/constants/index.ts"),
      "@contexts": path.resolve(__dirname, "./src/contexts/index.ts"),
      "@helpers": path.resolve(__dirname, "./src/helpers/index.ts"),
      "@hooks": path.resolve(__dirname, "./src/hooks/index.ts"),
      "@pages": path.resolve(__dirname, "./src/pages/index.ts"),
      "@routes": path.resolve(__dirname, "./src/routes/index.ts"),
      "@services": path.resolve(__dirname, "./src/services/index.ts"),
      "@theme": path.resolve(__dirname, "./src/theme/index.ts"),
      "@app-types": path.resolve(__dirname, "./src/types/index.ts"),
      "@utility": path.resolve(__dirname, "./src/utils/index.ts"),
    },
  },
  plugins: [react()],
});
