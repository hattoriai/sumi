// Appearance: "system" or one of the app's themes. The page lists its
// themes in data-sumi-themes on <html> and sets data-theme and
// data-theme-source before first paint with the boot snippet in the README;
// this module keeps them current. "system" follows the device: dark, or
// light when the device asks for it. Without a choice, Sumi is dark.
// A [data-sumi-theme-flip] button flips between ink and paper; any light
// theme flips to ink.
const KEY = 'sumi:theme';
const root = document.documentElement;
const lightSystem = matchMedia('(prefers-color-scheme: light)');

function themes() {
  return (root.dataset.sumiThemes || 'dark light').split(' ');
}

function current() {
  return root.dataset.themeSource === 'user' ? root.dataset.theme : 'system';
}

function syncButtons(choice = current()) {
  document.querySelectorAll('[data-sumi-theme]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.sumiTheme === choice));
  });
  syncFlips();
}

// A flip names what it does next, so it needs no pressed state.
function syncFlips() {
  const next = root.dataset.theme === 'dark' ? 'Switch to paper' : 'Switch to ink';
  document.querySelectorAll('[data-sumi-theme-flip]').forEach(button => {
    button.setAttribute('aria-label', next);
    button.title = next;
  });
}

export function applyTheme(choice) {
  const chosen = themes().includes(choice);
  root.dataset.theme = chosen ? choice : (lightSystem.matches ? 'light' : 'dark');
  root.dataset.themeSource = chosen ? 'user' : 'system';
  syncButtons(chosen ? choice : 'system');
}

function choose(choice) {
  try {
    if (themes().includes(choice)) localStorage.setItem(KEY, choice);
    else localStorage.removeItem(KEY);
  } catch { /* The choice still applies to this page. */ }
  applyTheme(choice);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-sumi-theme]');
  if (button) choose(button.dataset.sumiTheme);
  if (event.target.closest('[data-sumi-theme-flip]')) choose(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

// The theme can also change outside this module, for example in an app's
// settings or in Storybook's toolbar.
new MutationObserver(() => syncFlips()).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

lightSystem.addEventListener('change', () => {
  if (root.dataset.themeSource !== 'user') applyTheme('system');
});

window.addEventListener('storage', event => {
  if (event.key === KEY) applyTheme(event.newValue || 'system');
});

// LiveView navigation renders new toggles without their pressed state.
window.addEventListener('phx:page-loading-stop', () => syncButtons());
syncButtons();
