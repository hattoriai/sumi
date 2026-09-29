# Sumi Storybook

An internal reference for the Hattori app team. Stories import the shared CSS
and JavaScript directly; the preview build adds Tailwind v4 and daisyUI.
Development dependencies and stories are excluded from Sumi's package files.

## Local development

Use Node 22.22.2 or newer (the version is recorded in `.nvmrc`).

```sh
npm ci
npm run storybook
```

Open http://127.0.0.1:6006. The preview starts in Ink. Use the theme toolbar
for Paper or Snow, the viewport toolbar for screen sizes, and the
Accessibility panel to inspect a story. Expand **View example markup** below
a specimen for its HTML. Buttons / Playground has editable controls.
Fonts are bundled locally.

```sh
npm run build-storybook
npx playwright install chromium
npm run test:storybook
```

The tests serve `storybook-static` locally and check every story in all three
themes at desktop and phone widths, plus keyboard and interactive behaviour.
Rebuild before testing changes. These checks do not replace app integration
tests or a full accessibility audit.

## Adding a story

Add a `*.stories.js` file in `stories/`. Group it under Foundations, Controls,
or Patterns, import `page` from `helpers.js`, and use Sumi's existing classes.
Keep layout-only presentation in `.storybook/preview.css` with an `sb-` prefix.
Avoid duplicating component styles in the preview.

Use unique IDs (`uid`) for label associations and control targets. Escape
editable args with `escape` before interpolating them into HTML. The
`mountHook` helper mounts a LiveView hook after its element enters the DOM and
calls `destroyed` when Storybook removes it. Dialog stories mount on demand.
Server events are simulated locally; Phoenix processes, persistence, and
server validation are not part of the preview. Menu and form modules use
their existing document listeners. Theme selection belongs to Storybook's
toolbar, so `js/theme.js` is intentionally not imported into this preview.

Storybook installs npm daisyUI as `sumi-preview-daisyui` and aliases Phoenix's
vendored theme plugin path to `sumi-preview-daisyui/theme` within Vite. Do not
install a package named `daisyui` in Sumi: it would shadow the Phoenix apps'
vendored dependency when Tailwind resolves plugins from `sumi/css`. Apps
continue using the existing source imports.

## Private deployment at sumi.hattori.ai

Hosting: Cloudflare Pages. Authentication: Cloudflare Access. No separate
authentication app is needed. A static build contains no access control;
Access must protect it before serving it to visitors.

### 1. Prepare Access before publishing the library

1. Use an active Cloudflare zone for `hattori.ai` and enable the Zero Trust
   Free plan (currently up to 50 users).
2. Create a self-hosted Access application for `sumi.hattori.ai`, covering
   the whole hostname with no path restriction.
3. Enable email one-time PIN login and an Allow policy containing the exact
   email addresses of team members. Other visitors receive no access.
4. Start with a harmless placeholder Pages deployment while configuring
   the custom domain and the alternate URL protections below. Attach
   `sumi.hattori.ai` in Pages → Custom domains and complete DNS setup.

### 2. Protect all deployment addresses

Pages' preview Access switch does **not** automatically protect the production
custom domain or the production `pages.dev` address.

- Keep the Access application for `sumi.hattori.ai` enabled.
- Enable Access for previews (`*.PROJECT.pages.dev`) and restrict its policy
  to the same team. This includes branch aliases and deployment hashes.
- Create the Cloudflare account-level Bulk Redirect from
  `https://PROJECT.pages.dev` to `https://sumi.hattori.ai`, including all
  subpaths and preserving the path suffix and query string.
- Remove any unintended alternate custom domains, or protect them too.

Before deploying actual stories, use an unauthenticated browser and direct
HTTP requests to check every address: custom domain, production `pages.dev`,
a preview hash, and a branch alias. Check `/`, `/iframe.html`, `/index.json`,
and an actual `/assets/...js` URL. Requests must require login, deny access,
or redirect to the protected domain without returning the requested content.
Then verify an allowed email can open stories and a non-allowed email cannot.
Repeat these checks after publishing. Meta `noindex` tags are included for
indexing hygiene; they are not authentication.

### 3. Connect and build

Once the routes are protected, connect the Sumi GitHub repository to Pages
and configure:

| Setting | Value |
| --- | --- |
| Production branch | `main` (or the repository's chosen release branch) |
| Root directory | Repository root |
| Build command | `npm ci && npm run build-storybook` |
| Output directory | `storybook-static` |
| Environment variable | `NODE_VERSION=22.22.2` |
| Environment variable | `STORYBOOK_DISABLE_TELEMETRY=1` |

If using a separate placeholder project for setup, repeat its protection
configuration on the Git-connected project before allowing real builds.
Builds and preview deploys can then follow pushes and pull requests.
Never put credentials or real customer data in stories: authenticated
visitors can download all static assets.

Cloudflare account configuration is external to this repository. Building
locally does not deploy the site or enable Access.

References:

- [Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Pages custom domains and alternate URLs](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Preview Access configuration](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Access applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
- [Cloudflare Access pricing](https://www.cloudflare.com/plans/zero-trust-services/)
