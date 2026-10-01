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
          { value: 'light', title: 'Paper' },
          { value: 'snow', title: 'Snow' },
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
    return story();
  }],
};
