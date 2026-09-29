// Native dialog supplies focus containment and makes the page behind it inert.
//
// Escape and a click on the backdrop press the dialog's `[data-dialog-close]`
// button when it has one, so closing keeps that button's own event and
// target; without one they push `close_dialog`. The Left and Right arrow
// keys press `[data-dialog-prev]` and `[data-dialog-next]` when the dialog
// has them (not while typing in a field). When the dialog goes, focus
// returns to the element named by `data-return-focus` (an id), else to the
// element that had focus when it opened.
const STEPS = { ArrowLeft: '[data-dialog-prev]', ArrowRight: '[data-dialog-next]' };

export const SumiDialog = {
  mounted() {
    this.previousFocus = document.activeElement;
    this.el.showModal();
    this.onCancel = event => {
      event.preventDefault();
      this.dismiss();
    };
    this.onClick = event => {
      if (event.target === this.el) this.dismiss();
    };
    this.onKeydown = event => {
      const selector = STEPS[event.key];
      if (!selector || event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const button = this.el.querySelector(selector);
      if (button && !button.disabled) {
        event.preventDefault();
        button.click();
      }
    };
    this.el.addEventListener('cancel', this.onCancel);
    this.el.addEventListener('click', this.onClick);
    this.el.addEventListener('keydown', this.onKeydown);
  },
  dismiss() {
    const button = this.el.querySelector('[data-dialog-close]');
    if (button) button.click();
    else this.pushEvent('close_dialog', {});
  },
  destroyed() {
    this.el.removeEventListener('cancel', this.onCancel);
    this.el.removeEventListener('click', this.onClick);
    this.el.removeEventListener('keydown', this.onKeydown);
    const id = this.el.dataset.returnFocus;
    const target = (id && document.getElementById(id)) || this.previousFocus;
    if (target?.isConnected) target.focus();
  },
};
