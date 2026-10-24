import { page, section, uid } from './helpers.js';

export default { title: 'Controls/Navigation' };
export const PersonalMenu = {
  render: () => {
    const id = uid('menu');
    return page('Within reach', 'Open the personal menu, navigate with arrow keys, and press Escape to return to the trigger.',
      `<div style="min-height:18rem"><div data-sumi-menu style="position:relative;display:inline-block"><button class="sumi-avatar" aria-label="Open personal menu" aria-expanded="false" aria-controls="${id}">AL</button>
      <div id="${id}" class="sumi-menu-panel" hidden style="left:0;right:auto"><div class="sumi-menu-identity"><strong>Alex Lee</strong><span>alex@example.com</span></div><button class="sumi-menu-item">Account settings</button><button class="sumi-menu-item">Switch workspace</button><button class="sumi-menu-item">Sign out</button></div></div><p role="status" class="sb-note"></p></div>`, root => {
        root.querySelectorAll('.sumi-menu-item').forEach(button => { button.onclick = () => { root.querySelector('[role=status]').textContent = `Sample action: ${button.textContent}.`; }; });
      });
  },
};
export const SectionNavigation = {
  render: () => page('A place in the workspace', 'The current page has a blade underline and aria-current.',
    section('Settings', `<nav class="sumi-section-nav" aria-label="Workspace settings"><a href="#general" aria-current="page">General</a><a href="#team">Team</a><a href="#ai">AI settings</a></nav><p class="sb-note" role="status">General settings selected.</p>`), root => {
      root.querySelector('nav').onclick = event => {
        const link = event.target.closest('a');
        if (!link) return;
        event.preventDefault();
        root.querySelectorAll('nav a').forEach(item => item.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
        root.querySelector('[role=status]').textContent = `${link.textContent} settings selected.`;
      };
    }),
};
export const ThemeFlip = {
  render: () => page('Ink or paper', 'One yin-yang flips between ink and paper and remembers the choice. Its name says what it does next. On paper the dark half is at the top; on ink it turns to the bottom.',
    `<button type="button" class="sumi-theme-flip" data-sumi-theme-flip aria-label="Switch to paper" title="Switch to paper">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.25" />
    <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill="currentColor" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    <circle class="sumi-theme-flip-eye" cx="12" cy="17" r="1.5" />
  </svg>
</button>`),
};

export const ThemePicker = {
  render: () => {
    const id = uid('themes');
    return page('Every theme, one choice', 'The picker lists System and each of the app\'s themes, each with a swatch of itself. The choice is remembered in this browser; an app that saves it per person renders it as data-appearance.',
      `<div style="min-height:26rem"><div class="sumi-theme-picker" data-sumi-menu style="position:relative;display:inline-block"><button type="button" aria-expanded="false" aria-controls="${id}" aria-label="Theme"><span class="sumi-theme-swatch" data-sumi-theme-current-swatch aria-hidden="true"></span><span data-sumi-theme-current>System</span></button>
      <div id="${id}" class="sumi-menu-panel" hidden style="left:0;right:auto"><button type="button" class="sumi-menu-item" data-sumi-theme="system">System</button><p class="sumi-menu-group">Dark</p><button type="button" class="sumi-menu-item" data-sumi-theme="dark"><span class="sumi-theme-swatch" data-theme="dark" aria-hidden="true"></span>Ink</button><button type="button" class="sumi-menu-item" data-sumi-theme="smoke"><span class="sumi-theme-swatch" data-theme="smoke" aria-hidden="true"></span>Smoke</button><button type="button" class="sumi-menu-item" data-sumi-theme="stone"><span class="sumi-theme-swatch" data-theme="stone" aria-hidden="true"></span>Stone</button><button type="button" class="sumi-menu-item" data-sumi-theme="lacquer"><span class="sumi-theme-swatch" data-theme="lacquer" aria-hidden="true"></span>Lacquer</button><p class="sumi-menu-group">Light</p><button type="button" class="sumi-menu-item" data-sumi-theme="light"><span class="sumi-theme-swatch" data-theme="light" aria-hidden="true"></span>Paper</button><button type="button" class="sumi-menu-item" data-sumi-theme="snow"><span class="sumi-theme-swatch" data-theme="snow" aria-hidden="true"></span>Snow</button><button type="button" class="sumi-menu-item" data-sumi-theme="silk"><span class="sumi-theme-swatch" data-theme="silk" aria-hidden="true"></span>Silk</button></div></div></div>`);
  },
};
