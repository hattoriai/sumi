import { SumiDialog } from '../js/dialog.js';
import { page, uid } from './helpers.js';

export default { title: 'Controls/Dialogs' };
function dialogStory(large = false) {
  const id = uid('dialog');
  return page(large ? 'Room for the details' : 'Confirm a decision', 'Open the dialog. Escape or the backdrop closes it and returns focus to the trigger. This example uses the SumiDialog hook.',
    `<button id="${id}-trigger" class="btn ${large ? 'btn-primary' : 'btn-error'}">${large ? 'Open large preview' : 'Delete sample draft'}</button><p role="status" class="sb-note"></p>`, root => {
      let instance;
      const close = () => {
        if (!instance) return;
        instance.el.close();
        instance.destroyed();
        instance.el.remove();
        instance = null;
      };
      root.querySelector('button').onclick = () => {
        const dialog = document.createElement('dialog');
        dialog.className = `sumi-dialog${large ? ' sumi-dialog-large' : ''}`;
        dialog.dataset.returnFocus = `${id}-trigger`;
        dialog.setAttribute('aria-labelledby', `${id}-title`);
        dialog.innerHTML = `<div class="sumi-dialog-body"><div class="sumi-dialog-head"><h2 id="${id}-title">${large ? 'Workspace preview' : 'Delete this draft?'}</h2><button class="btn btn-ghost" data-dialog-close>Close</button></div><p>${large ? 'A large surface for reviewing a drawing or product preview.' : 'This removes the sample draft from this preview.'}</p>${large ? '<div class="sumi-sketch-missing" style="flex:1">Your screen preview goes here</div>' : '<div class="sumi-dialog-actions"><button class="btn btn-soft" data-cancel>Keep draft</button><button class="btn btn-error" data-confirm>Delete draft</button></div>'}</div>`;
        root.append(dialog);
        instance = { ...SumiDialog, el: dialog, pushEvent: close };
        dialog.querySelector('[data-dialog-close]').onclick = close;
        dialog.querySelector('[data-cancel]')?.addEventListener('click', close);
        dialog.querySelector('[data-confirm]')?.addEventListener('click', () => {
          close(); root.querySelector('[role=status]').textContent = 'Sample draft deleted.';
        });
        instance.mounted();
      };
      const observer = new MutationObserver(() => {
        if (!root.isConnected) { close(); observer.disconnect(); }
      });
      // Start observing once Storybook has inserted this render.
      requestAnimationFrame(() => {
        if (root.isConnected) observer.observe(document.body, { childList: true, subtree: true });
      });
    });
}
export const Confirmation = { render: () => dialogStory() };
export const LargePreview = { render: () => dialogStory(true) };
