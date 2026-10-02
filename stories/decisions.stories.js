import { page, section, toggles, mountHook, uid } from './helpers.js';
import { SumiDrag } from '../js/drag.js';

export default { title: 'Patterns/Decisions' };
export const Choices = {
  render: () => page('Make the choice clear', 'Selections use native buttons, a visible mark, and aria-pressed. Try a choice or toggle a word.',
    section('Choose one', `<div class="sumi-choices" data-single role="group" aria-label="Project approach">${[['Start small', 'One useful workflow, ready to try.'], ['Explore the whole', 'Map the broader experience first.']].map(([label, detail], i) => `<button class="sumi-choice" aria-pressed="${i === 0}"><span class="choice-indicator" aria-hidden="true"></span><span class="choice-text"><span class="choice-label">${label}</span><span class="choice-detail">${detail}</span>${i === 0 ? '<span class="sumi-recommended">Recommended: learn from a focused first release.</span>' : ''}</span></button>`).join('')}</div>`) +
    section('Choose several', `<fieldset class="sumi-words"><legend>What should this feel like?</legend><div class="sb-row">${['Clear', 'Calm', 'Playful', 'Precise'].map((label, i) => `<button class="sumi-chip" aria-pressed="${i === 0}">${label}</button>`).join('')}</div></fieldset>`) +
    section('Give a verdict', `<div class="sumi-verdicts" data-single role="group" aria-label="Review verdict">${['Right', 'Nearly right', 'Not right'].map(label => `<button class="sumi-toggle" aria-pressed="false">${label}</button>`).join('')}</div>`), toggles),
};

export const Ranking = {
  render: () => page('Put first things first', 'Move an item with the up and down controls. The first and last positions disable unavailable moves.',
    `<ol class="sumi-rank">${['Invite the team', 'Create a workspace', 'Review the first draft'].map(label => `<li class="sumi-rank-row"><span class="sumi-rank-number"></span><span>${label}</span><div class="sumi-rank-moves"><button class="sumi-icon-button" data-move="up" aria-label="Move ${label.toLowerCase()} up">↑</button><button class="sumi-icon-button" data-move="down" aria-label="Move ${label.toLowerCase()} down">↓</button></div></li>`).join('')}</ol><p role="status" class="sb-note"></p>`, root => {
      const list = root.querySelector('ol');
      const update = () => [...list.children].forEach((row, i) => {
        row.querySelector('.sumi-rank-number').textContent = i + 1;
        row.querySelector('[data-move=up]').disabled = i === 0;
        row.querySelector('[data-move=down]').disabled = i === list.children.length - 1;
      });
      update();
      list.onclick = event => {
        const button = event.target.closest('[data-move]');
        if (!button) return;
        const row = button.closest('li');
        if (button.dataset.move === 'up') row.previousElementSibling?.before(row);
        else row.nextElementSibling?.after(row);
        update();
        root.querySelector('[role=status]').textContent = 'Priority order updated.';
      };
    }),
};

export const BucketSorter = {
  render: () => {
    const id = uid('sorter');
    return page('Give work a place', 'Drag the sample card between buckets, or use its labelled move button. The drag behaviour uses SumiDrag.',
      `<div id="${id}" class="sumi-sorter" data-drop-op="move"><div class="sumi-sorter-buckets"><section class="sumi-sorter-bucket" data-drop-value="now"><h2>Now</h2><article class="sumi-sorter-card" data-drag-id="invite" draggable="true"><p>Invite the team</p><div class="sumi-sorter-moves"><button class="sumi-chip">Move to Later</button></div></article></section><section class="sumi-sorter-bucket" data-drop-value="later"><h2>Later</h2></section></div></div><p role="status" class="sb-note"></p>`, root => {
        const sorter = root.querySelector('.sumi-sorter');
        const card = root.querySelector('[data-drag-id]');
        const move = to => {
          sorter.querySelector(`[data-drop-value="${to}"]`).append(card);
          card.querySelector('button').textContent = `Move to ${to === 'now' ? 'Later' : 'Now'}`;
          root.querySelector('[role=status]').textContent = `Invite the team moved to ${to === 'now' ? 'Now' : 'Later'}.`;
        };
        card.querySelector('button').onclick = () => move(card.parentElement.dataset.dropValue === 'now' ? 'later' : 'now');
        mountHook(root, sorter, SumiDrag, (_event, payload) => move(payload.to));
      });
  },
};

export const GivenWhenThen = {
  render: () => page('Review an example', 'Concrete examples help a team agree on the expected behaviour.',
    `<div class="sumi-example"><dl class="sumi-given-when-then"><dt>Given</dt><dd>A teammate has an invitation.</dd><dt>When</dt><dd>They accept it.</dd><dt>Then</dt><dd>They can open the shared workspace.</dd></dl><div class="sumi-verdicts" data-single role="group" aria-label="Example verdict"><button class="sumi-toggle" aria-pressed="true">Right</button><button class="sumi-toggle" aria-pressed="false">Nearly right</button><button class="sumi-toggle" aria-pressed="false">Not right</button></div></div>`, toggles),
};

export const ExampleRecords = {
  render: () => {
    const id = uid('records');
    const records = [
      ['Tender', 'A request for work that a client puts out to bid.', [['Client', 'Navy'], ['Value', '€40,000'], ['Due', '12 May']]],
      ['Lot', 'One part of a tender that can be bid on alone.', [['Title', 'Catering, north base'], ['Value', '€12,000']]],
    ];
    const field = (label, value, i, j) => `<div class="sumi-record-field"><dt id="${id}-${i}-${j}">${label}</dt><dd><span class="sumi-record-value">${value}</span><button class="sumi-toggle" aria-pressed="${i === 0 && j === 2}" aria-label="Not right: ${label}">Not right</button></dd></div>`;
    return page('Show it as it looks', 'For people new to software: each thing is one filled example from their world. They mark what is not right, add what is missing, and answer each link with yes or no.',
      `<ul class="sumi-records" aria-label="Examples from your work">${records.map(([name, definition, fields], i) => `<li class="sumi-record"><div class="sumi-record-head"><h3 class="sumi-record-name" id="${id}-${i}">${name}</h3><button class="sumi-toggle" data-drop aria-pressed="false" aria-describedby="${id}-${i}">Not ours</button></div><p class="sumi-record-definition">${definition}</p><dl class="sumi-record-fields">${fields.map(([label, value], j) => field(label, value, i, j)).join('')}${i === 0 ? '<div class="sumi-record-field is-added"><dt>Contact</dt><dd><span class="sumi-record-value">added by you</span><button class="quiet-link">Remove</button></dd></div>' : ''}</dl><div class="sumi-inline-field"><label class="sr-only" for="${id}-${i}-missing">Something missing from ${name}</label><input class="input" id="${id}-${i}-missing" placeholder="Something missing?"><button class="sumi-chip">Add</button></div></li>`).join('')}</ul>` +
      section('How they fit together', `<ul class="sumi-record-links"><li class="sumi-record-link"><p id="${id}-link">Can one tender have several lots?</p><div class="sumi-verdicts" data-single role="group" aria-labelledby="${id}-link"><button class="sumi-toggle" aria-pressed="true">Yes</button><button class="sumi-toggle" aria-pressed="false">No</button></div></li></ul>`), root => {
        toggles(root);
        root.addEventListener('click', event => {
          const button = event.target.closest('[data-drop]');
          if (button) button.closest('.sumi-record').classList.toggle('is-dropped', button.getAttribute('aria-pressed') === 'true');
        });
      });
  },
};

export const OnePairAtATime = {
  render: () => {
    const pairs = [['Book a class', 'Make a reservation'], ['Hi Ana', 'Dear customer'], ['Short sentences', 'Full explanations'], ['Say what to do next', 'Show an error code']];
    const picks = [];
    let at = 0;
    const root = page('One pair at a time', 'A long list asked as quick pairs. Picking a side moves on; Back and Neither stay one step away, and the picks so far can be changed.', '<div class="sumi-deck" data-deck></div>');
    const deck = root.querySelector('[data-deck]');
    const draw = () => {
      const done = at >= pairs.length;
      const [a, b] = pairs[Math.min(at, pairs.length - 1)];
      deck.innerHTML = `<p class="sumi-deck-count" aria-live="polite">${done ? `All ${pairs.length} pairs seen` : `Pair ${at + 1} of ${pairs.length}`}</p><div class="sumi-deck-bar" style="--done: ${Math.round(100 * Math.min(at, pairs.length) / pairs.length)}%" aria-hidden="true"></div>` +
        (done ? '' : `<div class="sumi-pair" role="group" aria-label="Which sounds like you?">${[a, b].map((label, i) => `${i ? '<span class="sumi-pair-or" aria-hidden="true">or</span>' : ''}<button class="sumi-choice sumi-pair-side" data-side="${i}" aria-pressed="${picks[at] === i}"><span class="choice-label">${label}</span></button>`).join('')}</div><div class="sumi-deck-moves"><button class="quiet-link" data-back ${at === 0 ? 'disabled' : ''}>Back</button><button class="sumi-toggle" data-neither>Neither</button></div>`) +
        `<ul class="sumi-deck-picks" aria-label="Your picks">${picks.map((side, i) => side === undefined ? '' : `<li><span class="sumi-deck-kept">${pairs[i][side]}</span><span class="sumi-deck-not">${pairs[i][1 - side]}</span><button class="quiet-link" data-change="${i}">Change</button></li>`).join('')}</ul>`;
    };
    deck.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.side) { picks[at] = Number(button.dataset.side); at += 1; }
      else if ('neither' in button.dataset) { picks[at] = undefined; at += 1; }
      else if ('back' in button.dataset) at = Math.max(0, at - 1);
      else if (button.dataset.change) at = Number(button.dataset.change);
      draw();
    });
    draw();
    return root;
  },
};

export const Dial = {
  render: () => {
    const stops = [['A day or two', 'A small tool, or a quick test of the idea.'], ['A week or two', 'A focused first version.'], ['About six weeks', 'A first version people can rely on.'], ['A few months', 'Something big. The first slice should still be small.']];
    const id = uid('dial');
    const root = page('Turn the dial', 'Ordered choices as stops on one line between two words. Arrow keys move the dial; each stop is also a button.',
      `<div class="sumi-dial" style="--stops: ${stops.length}"><div class="sumi-dial-ends" aria-hidden="true"><span>Small</span><span>Big</span></div><label class="sr-only" for="${id}">How much time does this first version deserve?</label><input id="${id}" type="range" min="0" max="${stops.length - 1}" step="1" value="1"><div class="sumi-dial-stops">${stops.map(([label], i) => `<button class="sumi-dial-stop" data-stop="${i}" aria-pressed="${i === 1}">${label}</button>`).join('')}</div><p class="sumi-dial-chosen" aria-live="polite"></p></div>`);
    const input = root.querySelector('input');
    const set = value => {
      input.value = value;
      input.setAttribute('aria-valuetext', stops[value][0]);
      root.querySelectorAll('[data-stop]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stop) === value)));
      root.querySelector('.sumi-dial-chosen').innerHTML = `<strong>${stops[value][0]}</strong> <span>${stops[value][1]}</span>`;
    };
    input.addEventListener('input', () => set(Number(input.value)));
    root.addEventListener('click', event => { const stop = event.target.closest('[data-stop]'); if (stop) set(Number(stop.dataset.stop)); });
    set(1);
    return root;
  },
};
