# Security

## Reporting a vulnerability

Do not open a public issue for a security problem. Report it privately
through GitHub: [Report a vulnerability](https://github.com/hattoriai/sumi/security/advisories/new).

Say what an attacker can do, and how: the file, the markup or the stored
value, and the steps. We answer within a week, agree on a fix and a date,
and credit you in the advisory unless you ask us not to.

## Supported versions

Security fixes are made to the latest tag. Sumi is before 1.0, so a fix is
not backported to an earlier minor version.

## What is in scope

Sumi is CSS and a few small JS modules that run in an app's pages. A
problem is in scope when one of them can be made to:

- run script, or insert markup, from a value it reads: a `data-`
  attribute, a field, or the theme stored under `sumi:theme`;
- send a LiveView event, or a payload, that the page did not ask for
  (`js/dialog.js`, `js/drag.js`);
- hide or misstate what a person is confirming, such as a destructive
  dialog.

Also report privately a way to open the private Storybook at
`sumi.hattori.ai` without being let in.

Sumi's form validation helps the person; it is not a check. Validating
input, and the events a hook pushes, on the server is the app's job.
Storybook and its dependencies are not part of what apps install.
