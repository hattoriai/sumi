import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark', brandTitle: 'SUMI / Hattori',
    colorPrimary: '#e84a1c', colorSecondary: '#ff6b3d',
    appBg: '#0a0a0b', appContentBg: '#121214', appBorderColor: '#2a2a2e',
    appBorderRadius: 2, textColor: '#f5f0e8', barBg: '#121214',
  }),
});
