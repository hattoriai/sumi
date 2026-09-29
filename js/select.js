// LiveView adapter for the Sumi single-value select. Its ignored root owns local
// selection until submission; the named hidden input participates in the form.
// An option may carry `data-description`, a plain line shown under its label
// in the open list; the chosen option's description also shows under the
// control (`[data-select-description]`), named by the control's
// `aria-describedby`.
export const SumiSelect = {
  mounted() {
    const root = this.el;
    const trigger = root.querySelector('[aria-haspopup]');
    const list = root.querySelector('[role=listbox]');
    const input = root.querySelector('input');
    const description = root.querySelector('[data-select-description]');
    const options = [...list.querySelectorAll('[role=option]')];
    let search = '';
    let lastKey = 0;

    const close = (focus = false) => {
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (focus) trigger.focus();
    };
    const open = () => {
      list.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      (options.find(option => option.dataset.value === input.value) || options[0]).focus();
    };
    trigger.addEventListener('click', () => list.hidden ? open() : close(true));
    list.addEventListener('click', event => {
      const option = event.target.closest('[role=option]');
      if (!option) return;
      input.value = option.dataset.value;
      const label = option.querySelector('[data-option-label]');
      trigger.querySelector('[data-select-label]').textContent = (label || option).textContent.trim();
      options.forEach(item => item.setAttribute('aria-selected', String(item === option)));
      if (description) {
        const text = option.dataset.description || '';
        description.textContent = text;
        description.hidden = text === '';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      close(true);
    });
    root.addEventListener('keydown', event => {
      const index = options.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      } else if (event.key === 'Tab') {
        close();
      } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (list.hidden) open();
        else if (event.key === 'Home') options[0].focus();
        else if (event.key === 'End') options.at(-1).focus();
        else options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
      } else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        if (list.hidden) open();
        search = Date.now() - lastKey > 600 ? event.key : search + event.key;
        lastKey = Date.now();
        const startsWith = option =>
          (option.querySelector('[data-option-label]') || option).textContent.trim()
            .toLowerCase().startsWith(search.toLowerCase());
        options.find(startsWith)?.focus();
      }
    });
    this.outside = event => { if (!root.contains(event.target)) close(); };
    document.addEventListener('pointerdown', this.outside);
    this.blur = event => { if (!root.contains(event.relatedTarget)) close(); };
    root.addEventListener('focusout', this.blur);
  },
  destroyed() {
    document.removeEventListener('pointerdown', this.outside);
    this.el.removeEventListener('focusout', this.blur);
  },
};
