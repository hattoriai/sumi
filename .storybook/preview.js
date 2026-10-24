import './preview.css';
import '../js/forms.js';
import '../js/menu.js';
import '../js/theme.js';

export default {
  globalTypes: {
    theme: {
      description: 'Sumi appearance',
      toolbar: {
        title: 'Theme', icon: 'circlehollow', dynamicTitle: true,
        items: [
          { value: 'dark', title: 'Ink' },
          { value: 'smoke', title: 'Smoke' },
          { value: 'stone', title: 'Stone' },
          { value: 'lacquer', title: 'Lacquer' },
          { value: 'light', title: 'Paper' },
          { value: 'snow', title: 'Snow' },
          { value: 'silk', title: 'Silk' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    options: { storySort: { order: ['Foundations', 'Controls', 'Patterns'] } },
    docs: { codePanel: true },
  },
  decorators: [(story, context) => {
    document.documentElement.dataset.theme = context.globals.theme;
    document.documentElement.dataset.sumiThemes = 'dark smoke stone lacquer light snow silk';
    return story();
  }],
};
