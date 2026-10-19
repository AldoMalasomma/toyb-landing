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

Pending in this staging copy:

- dependency installation from `package-lock.json`;
- lint, formatting, typecheck and Astro checks;
- automated tests;
- production build;
- accessibility test.

## Visibility decision

**Private repository.** The project contains server-side waitlist and admin
functionality, database migrations, operational deployment workflows and
references to production configuration. It may be reconsidered for public
release only after a deliberate extraction of a public marketing-only surface
and a separate security review.

Proposed repository: `AldoMalasomma/toyb-landing` (private).
