# Project Context & Architecture Guidelines

This project is a static B2B foreign trade website.

Tech Stack: Hugo, SCSS, BEM, ITCSS.

This file applies to the whole repository unless a more specific nested `AGENTS.md` overrides it.

## 1. Hugo Architecture

- Strictly differentiate between:
  - `assets/`: SCSS/JS and other files processed through Hugo Pipes.
  - `static/`: raw files served as-is, such as images, downloads, and fonts.
  - `layouts/`: Hugo templates, partials, list pages, single pages, and reusable layout logic.
- Keep Hugo templates DRY by using partials where reuse is clear.
- Do not move files between `assets/`, `static/`, and `layouts/` unless the task explicitly requires it.
- Do not rewrite business copy, product claims, SEO titles, translations, or buyer-facing wording unless the task explicitly asks for content changes.

## 2. SCSS / ITCSS Rules

- Follow the existing ITCSS-style SCSS structure.
- Do not create, rename, or reorganize SCSS layer folders unless explicitly asked.
- Respect the existing import order.
- Use existing design tokens from `assets/scss/_vars.scss` whenever possible.
- Avoid hard-coded colors, spacing, radii, shadows, transitions, and breakpoints if a project token or mixin already exists.
- Keep CSS specificity low and predictable.

## 3. Naming Conventions

- Use BEM class names: `block__element--modifier`.
- Use BEM consistently in both HTML and SCSS.
- Avoid deep CSS nesting.
- Prefer flat selectors that are easy to override and maintain.
- Do not introduce utility-style class names unless the project already uses them for that purpose.

## 4. Tone & Design Direction

The UI/UX should communicate industrial trust, B2B professionalism, clarity, and stability.

Prefer:
- clean structure,
- clear hierarchy,
- restrained visual effects,
- readable spacing,
- accessible contrast,
- practical buyer-focused layouts.

Avoid:
- flashy consumer-style effects,
- excessive animation,
- decorative complexity,
- vague marketing embellishment.

---

# Behavioral Guidelines for Coding Tasks

These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

Do not assume silently.

Before implementing:
- State important assumptions explicitly.
- If multiple interpretations exist, mention the tradeoff.
- If uncertainty blocks a safe implementation, ask.
- Otherwise, state the assumption and proceed with the smallest reversible change.
- If a simpler approach solves the task, prefer it.
- Push back if the requested change would make the codebase more fragile or inconsistent.

## 2. Simplicity First

Use the minimum code needed to solve the problem.

- No features beyond what was asked.
- No abstractions for single-use code.
- No speculative flexibility or configurability.
- No unnecessary error handling for scenarios that cannot happen in this project.
- If a solution becomes much longer than necessary, simplify it before finalizing.
- Ask: “Would a senior engineer consider this overcomplicated?” If yes, reduce it.

## 3. Surgical Changes

Touch only what is necessary.

When editing existing code:
- Do not improve adjacent code, comments, or formatting unless required.
- Do not refactor unrelated code.
- Match the existing project style, even if another style seems preferable.
- If unrelated dead code or structural problems are found, mention them instead of changing them.
- Remove only the imports, variables, functions, or files made unused by your own changes.
- Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

Turn each task into verifiable goals.

For multi-step tasks, use a brief plan:

1. Step → verify: check
2. Step → verify: check
3. Step → verify: check

For this Hugo static site, verification usually means:
- run the available Hugo build command if possible;
- confirm SCSS compiles without errors;
- confirm affected templates/pages render correctly;
- check that no unrelated files were changed.

Only add tests when the project already has a test setup or when the task involves logic that clearly benefits from tests.

## 5. Final Response Requirements

After completing a task, summarize:
- what changed;
- which files were touched;
- how it was verified;
- any remaining risks or assumptions.

Do not over-explain obvious changes.
Do not claim verification was done if it was not actually run.