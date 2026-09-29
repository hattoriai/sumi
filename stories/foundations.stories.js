import { page, section } from './helpers.js';

export default { title: 'Foundations/Design language' };

export const Introduction = {
  render: () => page('墨 Sumi', ['Sumi means ink in Japanese.', 'Shared foundations, components, and patterns for Hattori apps. Built around ink and paper, fine lines, and a single orange accent.'],
    section('Ink, paper, a single mark', `<div class="sb-columns"><div class="sb-stack"><p class="sumi-display" style="font-size:clamp(2rem,4vw,3.5rem)">Give ideas<br>room to take shape.</p><p class="sb-note">Cormorant Garamond gives meaning room. Outfit keeps the interface clear. Blade marks an action or a change of state.</p></div><div class="sb-stack"><p class="sumi-wordmark">SU<span>MI</span></p><p>Hairlines. Quiet surfaces. Deliberate choices.</p><div class="sb-row"><span class="sumi-status settled">Settled</span><span class="sumi-level" data-level="inked"><span class="sumi-level-line" aria-hidden="true"></span><span class="sumi-level-word">Inked</span></span></div></div></div>`) +
    section('Using this library', `<div class="sb-columns"><p class="sb-note">Start with Foundations for tokens and typography. Controls show individual states. Patterns combine components into decisions, reviews and settings.</p><p class="sb-note">Use the theme and viewport tools to check each example. View example markup below each specimen. Interactions use sample data and reset when a story is reloaded.</p></div>`)),
};

export const Colours = {
  render: () => page('Colour & surface', 'Semantic tokens follow the selected theme. Blade stays the signature accent.',
    section('Surfaces and signals', `<div class="sb-columns">${[
      ['Canvas', '--color-base-100'], ['Raised surface', '--color-base-200'], ['Recessed surface', '--color-base-300'],
      ['Content', '--color-base-content'], ['Blade', '--color-sumi-blade'], ['Ember', '--color-sumi-ember'],
      ['Success text', '--sumi-success-text'], ['Error text', '--sumi-error-text'], ['Accent text', '--sumi-accent-text'],
    ].map(([name, token]) => `<div class="sb-token"><div class="sb-swatch" style="background:var(${token})" aria-hidden="true"></div><p>${name}</p><code>${token}</code></div>`).join('')}</div>`) +
    section('Text hierarchy', `<div class="sb-stack"><p>Primary — names, decisions, and the work itself.</p><p class="sumi-text-secondary">Secondary — context that helps you make a decision.</p><p class="sumi-text-muted">Muted — supporting metadata and timestamps.</p><p class="sumi-caption-contrast">Caption — small text on raised surfaces.</p></div>`)),
};

export const Typography = {
  render: () => page('Type with purpose', 'Cormorant Garamond 300 for display. Outfit 300 for interface text and 500 for labels.',
    section('Display', `<p class="sumi-display" style="font-size:clamp(2.5rem,6vw,5rem)">From a thought<br>to something <em style="color:var(--sumi-accent-text)">clear.</em></p>`) +
    section('Interface', `<div class="sb-stack"><p class="sumi-label">The next decision</p><p>Bring the team together around the work that matters.</p><p class="sumi-meta">Updated a moment ago</p><p class="sumi-wordmark">HAT<span>TORI</span></p></div>`)),
};

export const LevelsAndStatus = {
  render: () => page('State has a shape', 'Words and line weight carry meaning alongside colour.',
    section('Level marks', `<div class="sb-row">${['empty', 'sketched', 'drawn', 'inked'].map(level => `<span class="sumi-level" data-level="${level}"><span class="sumi-level-line" aria-hidden="true"></span><span class="sumi-level-word">${level[0].toUpperCase() + level.slice(1)}</span></span>`).join('')}</div>`) +
    section('Review status', `<div class="sb-row">${['draft', 'settled', 'open', 'inherited', 'proposed', 'rejected', 'assumption'].map(status => `<span class="sumi-status ${status}">${status === 'rejected' ? 'Not taken' : status[0].toUpperCase() + status.slice(1)}</span>`).join('')}</div>`)),
};
