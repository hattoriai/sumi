# Contributing to Sumi

Thank you for helping. This page says what to open (an issue, a pull
request, or a security report), what a pull request needs, and what the
maintainers keep for themselves. How to run Storybook and its browser
checks is in the README, under [Component library](README.md#component-library),
and in [the Storybook guide](docs/storybook.md).

## Questions, bugs and ideas

- **A bug.** Open an issue with the bug report form. The smallest markup
  that shows it (the HTML, and the Sumi files it imports) is the most
  useful thing you can give.
- **An idea or a change of behaviour.** Open an issue with the feature
  request form, and say the problem before the solution.
- **A security problem.** Do not open an issue. See
  [SECURITY.md](SECURITY.md).

Search the open and closed issues first: the idea may already be planned,
or turned down for a reason given there.

## When a pull request needs an issue first

Open an issue, and agree on the change there, before a pull request that:

- adds a component, a pattern, a theme, a token or a JS module;
- changes one of the README's [canonical choices](README.md#canonical-choices);
- renames or removes a class, a token, a `data-` attribute, a hook or an
  event a hook pushes, or changes what one does: apps depend on them;
- adds a dependency;
- touches many files, or needs a design decision.

A pull request does not need an issue when it is small and its reason is
plain from the diff: a typo, a broken link, a wrong sentence in the
README, or a bug fix with a test that fails without it. When in doubt,
open the issue: a short discussion costs less than a pull request that is
not merged.

A pull request with an issue says so: `Fixes #123` or `Closes #123`.

## A pull request

- **One change.** A fix, a new story for an unrelated component and a
  README edit are three pull requests. Each is reviewed, reverted and
  released on its own.
- **Why, not only what.** The description says the problem the change
  solves, for whom, and what happened before it: a wrong colour, a lost
  focus, a layout that breaks on a phone. Say why a value was chosen when
  the change adds one.
- **Tests.** A bug fix has a check in `tests/storybook.spec.mjs` that
  fails on `main` and passes with the fix. A new component or pattern has
  a story, and a check of its keyboard and interactive behaviour.
- **Every theme and width.** Look at the change in Ink, Paper and Snow, at
  desktop and phone widths, and with reduced motion. A screenshot of each
  helps the review of a visual change.
- **Docs.** A change an app can see updates the README section it
  belongs to, and its story.
- **The checks pass.** CI runs them; run them first, with Node 22.22.2 or
  newer (`.nvmrc`):

  ```sh
  npm ci
  npm run build-storybook
  npx playwright install chromium
  npm run test:storybook
  ```

  The tests run against the built Storybook, so rebuild after each change.

The pull request template has these as a checklist.

## What the maintainers keep

- **Releases.** The version in `package.json`, the tag in the README's
  install snippets and the git tags are changed by the maintainers, at a
  release.
- **The Storybook site.** The deployment to `sumi.hattori.ai`, and who can
  open it, are set up by the maintainers.

## Style

Match the code around your change: its naming, its comments and the way
the README is written. Use the tokens rather than new values, and do not
write `[data-theme="…"]` selectors in components. Stories follow
[Adding a story](docs/storybook.md#adding-a-story), with fictional sample
content.
