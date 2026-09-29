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
