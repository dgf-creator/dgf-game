import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { reactClickToComponent } from 'vite-plugin-react-click-to-component'
import { watchPassages } from './scripts/generatePassageDec'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    watchPassages()
  }

  return {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      reactClickToComponent(),
      viteSingleFile(),
    ],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
    },
  }
})
