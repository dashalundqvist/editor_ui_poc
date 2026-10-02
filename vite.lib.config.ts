import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// Separate from vite.config.ts on purpose: that one builds the demo app
// (index.html) and drives Storybook/Vitest. This one builds the publishable
// package — components + types + one CSS file — from src/index.ts only.
export default defineConfig({
  // Default (absolute "/") would emit font url()s as /InterVariable.woff2 —
  // resolved against the CONSUMER's domain root, not this package's own
  // files. Relative base makes them ./InterVariable.woff2 instead, resolved
  // against the CSS file's own location wherever node_modules puts it.
  base: './',
  // Don't copy public/ into the package output — favicon.svg etc. belong to
  // the demo app, not the published library.
  publicDir: false,
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src/index.ts', 'src/components/**/*.ts', 'src/components/**/*.tsx'],
      exclude: ['src/**/*.stories.tsx'],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    // Flat output (no nested assets/ subfolder) — matters for the relative
    // base above: Vite's relative-URL math assumes the default nested
    // assets/ layout, and gets the "../" prefix wrong once it isn't.
    assetsDir: '',
    // Without this, Vite base64-inlines the fonts straight into the CSS —
    // fine for an app with a known deploy path, wrong for a library: it
    // balloons the stylesheet to ~600KB and the consumer's bundler never
    // gets a chance to cache the font binaries separately.
    assetsInlineLimit: 0,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Consumers supply their own React — do not bundle it.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
