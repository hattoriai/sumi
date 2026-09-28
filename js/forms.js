// Shared inline validation. Server-side validation remains authoritative.
function messageFor(field) {
  const value = field.value.trim();
  const validity = field.validity;

  if (field.required && !value) return field.dataset.requiredMessage || 'Fill in this field.';
  if (validity.typeMismatch && field.type === 'email') return 'Enter a valid email address.';
  if (validity.typeMismatch && field.type === 'url') return 'Enter a full address, starting with https:// or http://.';
  if (validity.tooShort) return `Use at least ${field.minLength} characters.`;
  if (validity.tooLong) return `Use no more than ${field.maxLength} characters.`;
  if (validity.patternMismatch) return 'Check the format of this field.';
  if (!validity.valid) return 'Check this value and try again.';
  return null;
}

function clearError(field) {
  const errorId = field.dataset.sumiError;
  if (!errorId) return;
  document.getElementById(errorId)?.remove();
  const describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errorId);
  if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
  else field.removeAttribute('aria-describedby');
  field.removeAttribute('aria-invalid');
  delete field.dataset.sumiError;
}

let nextId = 0;

document.addEventListener('submit', event => {
  const form = event.target;
  if (!form.matches('form[data-sumi-form]')) return;
  let firstInvalid;

  for (const field of form.querySelectorAll('input, textarea, select')) {
    if (field.disabled || field.type === 'hidden' || field.readOnly) continue;
    clearError(field);
    const message = messageFor(field);
    if (!message) continue;

    const error = document.createElement('p');
    error.id = `sumi-field-error-${++nextId}`;
    error.className = 'sumi-field-error';
    error.textContent = message;
    error.setAttribute('role', 'alert');
    field.insertAdjacentElement('afterend', error);
    field.dataset.sumiError = error.id;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    firstInvalid ||= field;
  }

  if (firstInvalid) {
    event.preventDefault();
    event.stopImmediatePropagation();
    firstInvalid.focus();
  }
}, true);

document.addEventListener('input', event => {
  const field = event.target;
  if (field.dataset.sumiError && !messageFor(field)) clearError(field);
});
