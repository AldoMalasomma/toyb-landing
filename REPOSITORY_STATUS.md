# TOYB Landing — repository status

## Identity

This repository is the marketing, policy and waitlist website for TOYB. It is
separate from the TOYB SaaS application, which is maintained in the private
repository `AldoMalasomma/toyb-saas`.

Source preserved at:

`01_PROJECTS/01_code-works/toyb`

Staging copy:

`01_PROJECTS/TOYB/toyb-landing-candidate`

## Scope

- Astro marketing and policy pages;
- waitlist API and unsubscribe flow;
- private admin console and campaign APIs;
- Supabase migrations;
- Cloudflare Pages deployment workflows;
- brand, copy and accessibility documentation.

## Cleanup performed in staging

The staging copy excludes the source repository's local `.git` directory,
`.env` files, `node_modules`, `dist`, `.astro` and `.codex`. The original
source directory was not modified.

## Verification status

Results in this staging copy:

- automated tests: **pass** — 4 test files, 4 tests passed;
- production build: **pass** — Astro/Cloudflare build completed;
- lint: **fails** — 7 existing findings, including `@ts-nocheck`, unused
  parameters and `prefer-rest-params`;
- formatting: **fails** — Prettier reports 43 files needing formatting;
- typecheck: **fails** — 3 `ImportMeta.env` typing errors in API routes;
- accessibility test: **not completed** — the managed execution environment
  denied binding the local test server to `127.0.0.1:4173` (`EPERM`).

The failures are recorded as repository debt and were not silently fixed in
the staging copy.

## Visibility decision

**Private repository.** The project contains server-side waitlist and admin
functionality, database migrations, operational deployment workflows and
references to production configuration. It may be reconsidered for public
release only after a deliberate extraction of a public marketing-only surface
and a separate security review.

Proposed repository: `AldoMalasomma/toyb-landing` (private).
