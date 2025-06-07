import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      tailwindcss(),
      solidPlugin()
    ],
    server: {
      port: 3001,
    },
    build: {
      target: 'esnext',
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:7272'),
    },
  };
});
