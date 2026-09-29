import { page, section, uid } from './helpers.js';

export default { title: 'Patterns/Workspace' };
export const Settings = {
  render: () => {
    const id = uid('settings');
    return page('Workspace settings', 'An editorial introduction paired with a compact form. The layout stacks on narrow screens.',
      `<div class="sumi-settings"><div class="sumi-settings-intro"><p class="sumi-label">Your workspace</p><h1>Make room<br>for your team.</h1><p class="sumi-text-secondary">Give this shared space a name and a purpose.</p></div><form class="sumi-settings-form" novalidate data-sumi-form><div class="sumi-settings-field"><label for="${id}">Workspace name</label><input class="input w-full" id="${id}" name="name" required value="Field notes"></div><div class="sumi-settings-field"><label for="${id}-description">Purpose</label><textarea class="textarea w-full" id="${id}-description" rows="3">A place to shape our next product.</textarea></div><button class="btn btn-primary">Save changes</button><p role="status" class="fine-print"></p></form></div>`, root => {
        root.querySelector('form').onsubmit = event => { event.preventDefault(); root.querySelector('[role=status]').textContent = 'Sample settings saved.'; };
      });
  },
};
export const Review = {
  render: () => {
    const id = uid('review');
    return page('Keep the work moving', 'Changes and proposals retain their source and give the reviewer a clear next action.',
      `<aside class="sumi-notice" aria-labelledby="${id}"><h2 id="${id}">Review a change from your team</h2><div><p class="sumi-label">Audience</p><ul><li>The first release now includes workspace owners.</li></ul></div><button data-dismiss>Mark as reviewed</button></aside>` +
      section('A shaped decision', `<article class="sumi-board-page"><div class="page-heading"><h3>Start with one shared workspace</h3><span class="sumi-status proposed">Proposed</span></div><div class="page-body"><p>Help a small team agree on its first useful release before adding more structure.</p></div><div class="page-actions"><button class="approve">Approve</button><details><summary>Show the details</summary><p>Source: sample discovery conversation. No customer data.</p></details></div></article><p role="status" class="sb-note"></p>`), root => {
        root.querySelector('[data-dismiss]').onclick = () => { root.querySelector('aside').remove(); root.querySelector('[role=status]').textContent = 'Change reviewed.'; };
        root.querySelector('.approve').onclick = event => {
          const status = root.querySelector('.sumi-status'); status.className = 'sumi-status settled'; status.textContent = 'Settled'; event.target.disabled = true; event.target.textContent = 'Approved';
        };
      });
  },
};
export const FourBoxes = {
  render: () => page('A view of the whole', 'Four related regions keep their labels and readable content at every screen size.',
    `<div class="sumi-four-box">${[['Do first', 'Invite the team', true], ['Explore next', 'Shared review notes'], ['Keep simple', 'Workspace settings'], ['Leave for later', 'Cross-workspace reporting']].map(([title, body, focus]) => `<section class="sumi-box ${focus ? 'sumi-box-focus' : ''}"><h4>${title}</h4><p class="sumi-box-hint">${focus ? 'Focus here for the first release.' : 'A sample planning region.'}</p><p>${body}</p></section>`).join('')}</div>`),
};
export const Table = {
  render: () => page('A readable record', 'A caption, column headings, and an overflow wrapper keep tabular content understandable.',
    `<div class="sumi-table-wrap"><table class="sumi-table"><caption>Sample release decisions</caption><thead><tr><th scope="col">Decision</th><th scope="col">Owner</th><th scope="col">Status</th></tr></thead><tbody><tr><th scope="row">Invite the team</th><td>Alex</td><td><span class="sumi-status settled">Settled</span></td></tr><tr><th scope="row">Share review notes</th><td>Sam</td><td><span class="sumi-status open">Open</span></td></tr></tbody></table></div>`),
};
export const Loading = {
  render: () => page('While work arrives', 'Reserve the shape of the content while it loads. Reduced motion follows the shared accessibility styles.',
    `<div class="sumi-interview-skeleton" role="status" aria-label="Loading the next question"><div class="sumi-skeleton" style="height:2rem;width:65%" aria-hidden="true"></div><div class="sumi-skeleton" style="height:6rem;margin-top:1rem" aria-hidden="true"></div><span class="sr-only">Loading the next question…</span></div>`),
};
