// A disclosure menu: a trigger button and a panel of links or buttons.
// Markup: [data-sumi-menu] > button[aria-expanded][aria-controls] + [hidden] panel.
// The trigger toggles the panel; Escape, an outside click or a choice closes
// it; arrow keys, Home and End move between its items.
const ITEMS = 'a[href], button:not([disabled])';

function parts(menu) {
  const trigger = menu.querySelector(':scope > button[aria-controls]');
  const panel = trigger && document.getElementById(trigger.getAttribute('aria-controls'));
  return { trigger, panel };
}

function close(menu, { focus = false } = {}) {
  const { trigger, panel } = parts(menu);
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  if (focus) trigger.focus();
}

function open(menu) {
  document.querySelectorAll('[data-sumi-menu]').forEach(other => other !== menu && close(other));
  const { trigger, panel } = parts(menu);
  panel.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  panel.querySelector(ITEMS)?.focus();
}

document.addEventListener('click', event => {
  const menu = event.target.closest('[data-sumi-menu]');
  document.querySelectorAll('[data-sumi-menu]').forEach(other => other !== menu && close(other));
  if (!menu) return;

  const { trigger, panel } = parts(menu);
  if (event.target.closest('button[aria-controls]') === trigger) {
    panel.hidden ? open(menu) : close(menu);
  } else if (event.target.closest(ITEMS)) {
    close(menu);
  }
});

document.addEventListener('keydown', event => {
  const menu = event.target.closest?.('[data-sumi-menu]');
  if (!menu) return;
  const { panel } = parts(menu);
  if (!panel || panel.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    close(menu, { focus: true });
    return;
  }

  const items = [...panel.querySelectorAll(ITEMS)];
  const index = items.indexOf(document.activeElement);
  const next = {
    ArrowDown: items[(index + 1) % items.length],
    ArrowUp: items[(index - 1 + items.length) % items.length],
    Home: items[0],
    End: items[items.length - 1],
  }[event.key];

  if (next) {
    event.preventDefault();
    next.focus();
  }
});

document.addEventListener('focusout', event => {
  const menu = event.target.closest?.('[data-sumi-menu]');
  if (menu && event.relatedTarget && !menu.contains(event.relatedTarget)) close(menu);
});
