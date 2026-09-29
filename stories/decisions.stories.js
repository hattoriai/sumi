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
