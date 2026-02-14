// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://OpusEnigma.github.io',

  // Le nom du repo
  base: '/nuptiae/',

  devToolbar: {
    enabled: false,
  },

  integrations: [react()],
});