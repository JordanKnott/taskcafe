const path = require('path');

module.exports = {
  stories: ['../src/shared/components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-backgrounds/register',
  ],
  webpackFinal: async config => {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));
    return config;
  },
};
