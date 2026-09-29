import { SumiSelect } from '../js/select.js';
import { page, uid, mountHook } from './helpers.js';

export default { title: 'Controls/Forms' };

export const Validation = {
  render: () => {
    const id = uid('form');
    return page('Errors that help', 'Submit an empty form to see inline validation. Correct a field to clear its error. These examples never send data.',
      `<form class="sb-stack sb-narrow" novalidate data-sumi-form>
        <div class="sb-field"><label for="${id}-name">Workspace name</label><input class="input" id="${id}-name" name="name" required data-required-message="Give your workspace a name." placeholder="Field notes"></div>
        <div class="sb-field"><label for="${id}-email">Email</label><input class="input" id="${id}-email" name="email" type="email" required placeholder="alex@example.com"></div>
        <div class="sb-field"><label for="${id}-notes">Description</label><textarea class="textarea" id="${id}-notes" name="notes" rows="3" placeholder="What will you work on?"></textarea></div>
        <div><button class="btn btn-primary" type="submit">Create workspace</button></div><p role="status" class="sb-note"></p>
      </form>`, root => {
        root.querySelector('form').onsubmit = event => {
          event.preventDefault();
          root.querySelector('[role=status]').textContent = 'Sample workspace created. No data was sent.';
        };
      });
  },
};

export const FieldStates = {
  render: () => {
    const id = uid('states');
    return page('Field states', 'Native controls use the shared daisyUI theme.', `<div class="sb-stack sb-narrow">
      <label class="sb-field">Default<input class="input" placeholder="Workspace name"></label>
      <label class="sb-field">Disabled<input class="input" value="Archived workspace" disabled></label>
      <label class="sb-field">Read only<input class="input" value="field-notes" readonly></label>
      <div class="sb-field"><label for="${id}">Email</label><input id="${id}" class="input" value="alex@" aria-invalid="true" aria-describedby="${id}-error"><p id="${id}-error" class="sumi-field-error">Enter a valid email address.</p></div>
      <label class="sb-field">Native select<select class="select"><option>Ink</option><option>Paper</option><option>Snow</option></select></label>
    </div>`);
  },
};

export const CustomSelect = {
  render: () => {
    const id = uid('select');
    return page('A considered choice', 'The SumiSelect hook supports arrows, Home, End, typeahead, Enter, Escape, and outside dismissal.',
      `<div class="sb-stack sb-narrow"><span id="${id}-label">Default appearance</span>
      <div class="sumi-select" id="${id}"><input type="hidden" name="appearance" value="dark">
      <button type="button" class="select" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-options" aria-labelledby="${id}-label ${id}-value"><span id="${id}-value" data-select-label>Ink</span></button>
      <div class="sumi-select-options" id="${id}-options" role="listbox" aria-labelledby="${id}-label" hidden>
      ${[['dark', 'Ink'], ['light', 'Paper'], ['snow', 'Snow']].map(([value, label]) => `<button type="button" role="option" tabindex="-1" data-value="${value}" aria-selected="${value === 'dark'}">${label}</button>`).join('')}
      </div></div><p role="status" class="sb-note">Selected value: dark</p></div>`, root => {
        mountHook(root, root.querySelector('.sumi-select'), SumiSelect);
        root.addEventListener('input', event => { root.querySelector('[role=status]').textContent = `Selected value: ${event.target.value}`; });
      });
  },
};
