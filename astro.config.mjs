// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

const basePath = process.env.PUBLIC_BASE_PATH || '/nuptiae/';

// https://astro.build/config
export default defineConfig({
  site: 'https://OpusEnigma.github.io',

  // Base path from environment variable
  base: basePath,

  devToolbar: {
    enabled: false,
  },

  integrations: [react()],
});