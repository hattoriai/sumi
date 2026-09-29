export function escape(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

let nextId = 0;
export const uid = prefix => `${prefix}-${++nextId}`;

export function page(title, description, markup, setup) {
  const root = document.createElement('main');
  root.className = 'sb-page';
  root.innerHTML = `<header class="sb-head"><p class="sumi-label">Sumi / Hattori</p><h1 class="sumi-display">${escape(title)}</h1>${[].concat(description).map(text => `<p>${escape(text)}</p>`).join('')}</header><div data-example>${markup}</div><details class="sb-code"><summary>View example markup</summary><pre><code>${escape(markup.trim())}</code></pre></details>`;
  setup?.(root);
  return root;
}

export const section = (title, markup) => `<section class="sb-section"><h2>${escape(title)}</h2>${markup}</section>`;

// Each render receives fresh DOM. Mount only after insertion and destroy when
// Storybook removes it (navigation, args updates, or theme changes).
export function mountHook(root, element, hook, pushEvent = () => {}) {
  const instance = { ...hook, el: element, pushEvent };
  let mounted = false;
  const observer = new MutationObserver(() => {
    if (root.isConnected && !mounted) {
      mounted = true;
      instance.mounted?.();
    } else if (!root.isConnected && mounted) {
      instance.destroyed?.();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return instance;
}

export function toggles(root) {
  root.addEventListener('click', event => {
    const button = event.target.closest('button[aria-pressed]');
    if (!button || button.disabled) return;
    const group = button.closest('[data-single]');
    const pressed = button.getAttribute('aria-pressed') === 'true';
    if (group) group.querySelectorAll('[aria-pressed]').forEach(item => item.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', String(group ? true : !pressed));
  });
}
