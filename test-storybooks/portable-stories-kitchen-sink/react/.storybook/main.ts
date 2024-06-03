import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-jest",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // This is needed because addon-jest uses normalize which relies on node polyfills
  // and such polyfills are not provided in the Vite builder
  async viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        path: require.resolve('path-browserify'),
      },
    }

    return config
  },
};
export default config;
