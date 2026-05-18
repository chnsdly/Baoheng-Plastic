# AGENTS.md

## Scope
This repository is a static B2B foreign-trade website built with Hugo.

Stack: Hugo, SCSS, BEM, ITCSS.

These are repository-wide defaults. A nearer `AGENTS.md` overrides them. Explicit task requirements win.

## Operating principles
Prefer the smallest correct change.
Match the existing codebase before introducing anything new.
Do not refactor, rename, reorganize, or add dependencies unless the task requires it.
If the request is ambiguous, state the key assumption and choose the safest reversible path.
For non-trivial work, write a short plan before editing.

## Work at the right layer
- `content/` and front matter for content changes.
- `layouts/` for templates, partials, and rendering logic.
- `assets/` for pipeline-managed SCSS, JS, images, and other global resources.
- `static/` for files that must be published as-is.
- Page-bundled resources stay with their page unless the task explicitly requires a move.
- `public/` and `resources/` are build artifacts; do not edit them manually.

Do not move files across these boundaries unless the task explicitly requires it.

## Hugo rules
Follow the repository’s existing template structure, partial pattern, and lookup strategy.
Reuse existing base templates and partials when that clearly reduces duplication; do not create one-off abstractions.
Do not change site configuration, URLs, permalinks, front matter schema, languages, taxonomies, or output formats unless asked.
Do not rewrite business copy, SEO text, translations, or product claims unless asked.

## Styles
Keep the current ITCSS structure and import order.
Use existing tokens, variables, mixins, and breakpoints before adding new values.
Use BEM consistently in markup and SCSS.
Keep selectors flat, nesting shallow, and specificity low.
Prefer HTML and CSS solutions before adding JavaScript.
Do not introduce utility classes unless the project already uses them.

## Design standard
Aim for industrial clarity: trustworthy, calm, practical, and buyer-focused.
Prefer clear hierarchy, readable spacing, accessible contrast, and restrained effects.
Avoid flashy motion, decorative complexity, and consumer-style styling.

## Execution
Inspect the relevant files before editing.
Touch only files required by the request.
Remove only code made unused by your own change.
Before finishing, run the relevant project commands if they exist. Prefer the repository’s actual Hugo, build, lint, and test commands; do not invent new workflows.
Verify the affected pages or templates render as expected and that unrelated files were not changed.

## Response
Report:
- what changed
- files touched
- verification performed
- remaining assumptions or risks

Never claim a check was run when it was not.
