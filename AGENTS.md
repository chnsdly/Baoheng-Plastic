# Project Context & Architecture Guidelines
This project is a static B2B foreign trade website.
Tech Stack: Hugo, SCSS, BEM, ITCSS.

- **Hugo Architecture:** Strictly differentiate between `assets/` (for SCSS/JS processed via Hugo Pipes), `static/` (for raw files like images/fonts), and `layouts/` (keep templates DRY using partials).
- **CSS Methodology:** Strictly adhere to the ITCSS (Inverted Triangle CSS) architecture for file organization. 
- **Naming Conventions:** Strictly use BEM (`block__element--modifier`) for all HTML classes and SCSS. Avoid deep CSS nesting; keep specificity flat.
- **Tone & Design:** The UI/UX should communicate industrial trust and B2B professionalism.

---
# Behavioral guidelines to reduce common LLM coding mistakes. 
Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
Before implementing:
* State your assumptions explicitly. If uncertain, ask.
* If multiple interpretations exist, present them - don't pick silently.
* If a simpler approach exists, say so. Push back when warranted.
* If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
* No features beyond what was asked.
* No abstractions for single-use code.
* No "flexibility" or "configurability" that wasn't requested.
* No error handling for impossible scenarios.
* If you write 200 lines and it could be 50, rewrite it.
* Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
When editing existing code:
* Don't "improve" adjacent code, comments, or formatting.
* Don't refactor things that aren't broken.
* Match existing style, even if you'd do it differently.
* If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:
* Remove imports/variables/functions that YOUR changes made unused.
* Don't remove pre-existing dead code unless asked.
* The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution
Define success criteria. Loop until verified.
Transform tasks into verifiable goals:
* "Add validation" → "Write tests for invalid inputs, then make them pass"
* "Fix the bug" → "Write a test that reproduces it, then make it pass"
* "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.