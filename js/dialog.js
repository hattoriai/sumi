// Native dialog supplies focus containment and makes the page behind it inert.
export const SumiDialog = {
  mounted() {
    this.previousFocus = document.activeElement;
    this.el.showModal();
    this.onCancel = event => {
      event.preventDefault();
      this.pushEvent('close_dialog', {});
    };
    this.onClick = event => {
      if (event.target === this.el) this.pushEvent('close_dialog', {});
    };
    this.el.addEventListener('cancel', this.onCancel);
    this.el.addEventListener('click', this.onClick);
  },
  destroyed() {
    this.el.removeEventListener('cancel', this.onCancel);
    this.el.removeEventListener('click', this.onClick);
    if (this.previousFocus?.isConnected) this.previousFocus.focus();
  },
};
