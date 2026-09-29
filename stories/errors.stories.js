import { page } from './helpers.js';
export default { title: 'Patterns/Error pages' };
function errorPage(code) {
  return page('A way back', 'Branded error pages explain what happened and offer a recovery action.', `<div class="sumi-error"><div><p class="sumi-error-code" aria-hidden="true">${code}</p><p class="sumi-label">${code === 404 ? 'Page not found' : 'Something went wrong'}</p><h1 class="sumi-display">${code === 404 ? 'This page has moved on.' : 'A pause in the work.'}</h1><p class="sumi-error-description">${code === 404 ? 'The address may have changed, or this page may no longer exist.' : 'We could not load this page. Try again in a moment.'}</p><button class="btn btn-primary">${code === 404 ? 'Back to workspace' : 'Try again'}</button><p role="status" class="sb-note"></p></div><div class="sumi-error-mark" aria-hidden="true">墨</div></div>`, root => {
    root.querySelector('button').onclick = () => { root.querySelector('[role=status]').textContent = 'Recovery action selected in this preview.'; };
  });
}
export const NotFound = { render: () => errorPage(404) };
export const ServerError = { render: () => errorPage(500) };
