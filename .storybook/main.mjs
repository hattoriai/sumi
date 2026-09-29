import tailwindcss from '@tailwindcss/vite';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
  stories: ['../stories/**/*.stories.js'],
  framework: '@storybook/html-vite',
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
  async viteFinal(config) {
    // Keep the npm preview package under an alias so it cannot shadow
    // the Phoenix apps' vendored daisyui during shared CSS resolution.
    config.resolve = { ...config.resolve, alias: { ...config.resolve?.alias,
      'daisyui/packages/bundle/daisyui-theme': require.resolve('sumi-preview-daisyui/theme'),
    } };
    config.plugins = [...(config.plugins || []), tailwindcss()];
    return config;
  },
};
