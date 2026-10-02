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

// The layout the app draws on the server, in a few lines: a map with the
// most linked thing in the middle for wide spaces, a column with arcs for
// narrow ones.
const domain = {
  things: [['Tender', 'Client · Value · Due'], ['Lot', 'Title · Value'], ['Client', 'Name · Country'], ['Bid', 'Price · Sent on']],
  links: [[0, 1, 'one_many', ''], [2, 0, 'one_many', 'puts out'], [0, 3, 'one_many', ''], [3, 1, 'many_many', '', true]],
};
const ends = cardinality => ({ one_one: ['1', '1'], one_many: ['1', 'many'], many_many: ['many', 'many'] })[cardinality];
const thing = (x, y, w, h, [name, detail], main) => `<g class="sumi-domain-thing${main ? ' is-main' : ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"></rect><text class="sumi-domain-name" x="${x + 12}" y="${y + 26}">${name}</text><text class="sumi-domain-detail" x="${x + 12}" y="${y + 44}">${detail}</text></g>`;
function wideMap() {
  const w = 150, h = 56, cx = 320, rx = 240, ry = 150, cy = ry + h / 2 + 24;
  const pos = [[cx, cy]];
  const around = domain.things.length - 1;
  for (let i = 0; i < around; i += 1) { const a = -Math.PI / 2 + (2 * Math.PI * i) / around; pos.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  const clip = ([x1, y1], [x2, y2]) => { const dx = x2 - x1, dy = y2 - y1; const t = Math.min(dx ? (w / 2) / Math.abs(dx) : Infinity, dy ? (h / 2) / Math.abs(dy) : Infinity); return [x1 + dx * t, y1 + dy * t]; };
  const links = domain.links.map(([a, b, card, label, open]) => {
    const [ax, ay] = clip(pos[a], pos[b]), [bx, by] = clip(pos[b], pos[a]);
    const d = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / d, uy = (by - ay) / d;
    // Beside the line, 18px in from each end.
    const at = (x, y, s) => [x + s * ux * 18 - uy * 10, y + s * uy * 18 + ux * 10 + 4];
    const [e1x, e1y] = at(ax, ay, 1), [e2x, e2y] = at(bx, by, -1), [from, to] = ends(card);
    return `<g class="sumi-domain-link${open ? ' is-open' : ''}"><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"></line><text class="sumi-domain-end" x="${e1x}" y="${e1y}" text-anchor="middle">${from}</text><text class="sumi-domain-end" x="${e2x}" y="${e2y}" text-anchor="middle">${to}</text>${label ? `<text class="sumi-domain-label" x="${(ax + bx) / 2 + uy * 10}" y="${(ay + by) / 2 - ux * 10 + 4}" text-anchor="middle">${label}</text>` : ''}</g>`;
  }).join('');
  const height = Math.max(...pos.map(([, y]) => y)) + h / 2 + 24;
  return `<svg class="sumi-domain-map-wide" viewBox="0 0 640 ${height}" aria-hidden="true">${links}${domain.things.map((t, i) => thing(pos[i][0] - w / 2, pos[i][1] - h / 2, w, h, t, i === 0)).join('')}</svg>`;
}
function narrowMap() {
  const w = 200, h = 52, row = 72, right = 16 + w;
  // Each link leaves a thing at its own height, so the ends stack.
  const used = domain.things.map(() => 0);
  const slot = i => { const k = used[i]; used[i] += 1; return 16 + i * row + 8 + (k % 4) * 12; };
  const links = domain.links.map(([a, b, card, label, open]) => {
    const y1 = slot(a), y2 = slot(b), d = Math.min(36 + Math.abs(y2 - y1) / 2, 130), [from, to] = ends(card);
    return `<g class="sumi-domain-link${open ? ' is-open' : ''}"><path d="M ${right} ${y1} C ${right + d} ${y1}, ${right + d} ${y2}, ${right} ${y2}"></path><text class="sumi-domain-end" x="${right + 4}" y="${y1 + 4}">${from}</text><text class="sumi-domain-end" x="${right + 4}" y="${y2 + 4}">${to}</text>${label ? `<text class="sumi-domain-label" x="${right + d * 0.75 + 4}" y="${(y1 + y2) / 2 + 4}">${label}</text>` : ''}</g>`;
  }).join('');
  return `<svg class="sumi-domain-map-narrow" viewBox="0 0 360 ${16 + domain.things.length * row}" aria-hidden="true">${links}${domain.things.map((t, i) => thing(16, 16 + i * row, w, h, t, i === 0)).join('')}</svg>`;
}
export const DomainMap = {
  render: () => page('A picture of their world', 'The things a product keeps and how they belong together. Wide spaces get a map; narrow ones a column with arcs. The same links stay in words beside it.',
    `<figure class="sumi-domain-map">${wideMap()}${narrowMap()}<figcaption>Lines join things that belong together; “many” marks the side that can have several. A dashed line is not answered yet.</figcaption></figure>` +
    section('In words', '<ul><li>One tender has many lots.</li><li>One client puts out many tenders.</li><li>One tender has many bids.</li><li>Not answered yet: can a bid cover several lots?</li></ul>')),
};
