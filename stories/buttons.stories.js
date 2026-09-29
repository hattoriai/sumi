import { page, section, escape } from './helpers.js';

export default {
  title: 'Controls/Buttons',
  args: { label: 'Save changes', variant: 'primary', disabled: false },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'soft', 'ghost', 'error'] },
    disabled: { control: 'boolean' },
  },
};

export const Playground = {
  render: ({ label, variant, disabled }) => page('An intentional action', 'Use the controls panel to change the label, emphasis, and disabled state.',
    `<div class="sb-stack sb-narrow"><div><button type="button" class="btn btn-${escape(variant)}" ${disabled ? 'disabled' : ''}>${escape(label)}</button></div><p role="status" class="sb-note"></p></div>`, root => {
      root.querySelector('button').onclick = () => { root.querySelector('[role=status]').textContent = 'Sample action completed.'; };
    }),
};
export const Disabled = { ...Playground, args: { disabled: true } };
export const Variants = {
  render: () => page('Action hierarchy', 'Use one primary action in a group. Supporting actions keep quieter emphasis.',
    section('Available', `<div class="sb-row"><button class="btn btn-primary">Save changes</button><button class="btn btn-soft">Preview</button><button class="btn btn-ghost">Cancel</button><button class="btn btn-error">Delete draft</button></div>`) +
    section('Unavailable', `<div class="sb-row"><button class="btn btn-primary" disabled>Save changes</button><button class="btn btn-soft" disabled>Preview</button><button class="sumi-icon-button" disabled aria-label="Move up">↑</button></div>`) +
    section('Icon controls', `<div class="sb-row"><button class="sumi-icon-button" aria-label="Move up">↑</button><button class="sumi-icon-button" aria-label="Move down">↓</button></div><p role="status" class="sb-note"></p>`), root => {
      root.querySelector('[data-example]').addEventListener('click', event => {
        const button = event.target.closest('button');
        if (button) root.querySelector('[role=status]').textContent = `Sample action: ${button.getAttribute('aria-label') || button.textContent}.`;
      });
    }),
};
