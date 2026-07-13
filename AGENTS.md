# AGENTS.md

## Scope and Priorities

This file contains repository-wide instructions for every website task. Workflow-specific prompts may add stricter rules for their own files and outputs, but they must not weaken the factual, multilingual, accessibility, or verification standards here.

The site serves manufacturers, warehouses, logistics operators, distributors, exporters, procurement teams, and other industrial buyers. Work should reduce uncertainty about product suitability, load conditions, handling, storage, transport, hygiene, documentation, and the next responsible action.

Use this priority order:

1. customer utility and factual credibility;
2. clear multilingual user experience;
3. maintainable implementation and performance.

Do not expand the site merely to increase page count, keyword coverage, visual decoration, or feature count.

## Factual and Editorial Standards

- Write customer-facing, near-production-quality content.
- Distinguish verified facts, typical practice, experience-based guidance, and conditions requiring supplier or site validation.
- Never fabricate customer cases, certifications, test results, load ratings, dimensions, material composition, temperature ranges, food-contact status, production capacity, company strengths, sustainability results, trends, standards, regulations, or URLs.
- Use specific data only when it is verified for the relevant model, method, jurisdiction, and operating condition.
- Keep static, dynamic, and racking load distinct. Qualify load distribution, support method, rack span, equipment, temperature, duration, and safety margin when material.
- Keep nestable, stackable, rackable, reversible, export, hygienic, spill-containment, and other pallet structures distinct.
- A standard test does not by itself approve a pallet for a customer's site. A material category does not establish model-level performance.
- Use qualifiers such as "typically," "subject to actual load and handling conditions," and "confirm against the manufacturer's current product data" when exact facts are unavailable.
- Explain relevant non-suitable conditions. Do not imply that plastic pallets or one pallet structure are correct for every route.
- Keep commercial language restrained. Resolve the buyer's question before introducing products or a CTA.
- Use internal links to support a real research path, not merely to distribute keywords.

## Page and Content Design

Every page or section must help the visitor understand, judge, trust, navigate, or act. Remove decorative or repetitive material that serves none of those purposes.

- Present the most decision-relevant information first, then details, tables, diagrams, downloads, and supporting evidence.
- Use visuals when they clarify structure, dimensions, entry type, nesting, stacking, handling, racking, cleaning, comparison, or evidence.
- Maintain clear heading order, descriptive links, meaningful alt text, concise titles, and useful descriptions.
- Keep product, application, procurement-support, and resource content in distinct roles.
- Create SKU pages only when they contain meaningful model-specific information. Do not create thin near-duplicates.
- Provide complete operational and trust information where relevant, including limitations, inquiry expectations, contact details, privacy, and terms.

## Visual and Interaction Standards

Use the existing design system before adding parallel patterns.

- Keep typography, spacing, containers, radii, borders, shadows, buttons, forms, navigation, and states coherent across templates and languages.
- Solve systemic layout problems in shared components rather than with arbitrary offsets or page-specific patches.
- Prefer restrained visual treatment. Decoration must communicate structure, state, or action.
- Make interactive elements recognizable and provide consistent hover, focus, active, expanded, and disabled states.
- Ensure keyboard access, visible focus, adequate contrast, usable tap targets, and reduced-motion support where motion exists.
- Design responsive hierarchy and content order deliberately; do not merely compress desktop layouts.
- Test navigation, forms, diagrams, tables, and long multilingual labels at representative desktop and mobile widths.
- Forms need readable labels, clear required and validation states, and a straightforward completion path.

## Hugo and Asset Conventions

Use the existing Hugo site with SCSS and BEM. Prefer semantic static rendering, low JavaScript usage, and existing tokens, mixins, partials, data files, and components.

- Current multilingual content is organized under content/english/, content/chinese/, content/spanish/, and content/french/. Preserve that convention and stable translation relationships.
- Current shared resource imagery is stored under static/images/resources/. Do not introduce page-bundle media or a new language-file convention without an explicit coordinated migration.
- Shared brand, UI, and product-family assets remain in shared asset directories.
- Do not hard-code interface text that belongs in i18n data or language-specific content.
- Minimize scripts and third-party dependencies. Use SVG for suitable diagrams and optimized modern raster formats for photography or detailed imagery.
- Cloudflare performs the production build. Local validation must use an explicit destination outside public/, normally .codex-build/.
- prompts/ and runs/ are local operating records ignored by Git. Do not force-add them to the public repository.
- When an external service is required, keep the Hugo-side contract clean and leave an explicit integration point.

## Development Practice

Before editing:

1. inspect relevant templates, styles, data, content, configuration, and current Git status;
2. identify the visitor or system problem and the responsible component;
3. preserve unrelated user changes;
4. choose the smallest coherent solution consistent with existing patterns.

During implementation:

- Fix root causes, not only visible symptoms.
- Keep scope proportional to the request and regression risk.
- Reuse established abstractions; add one only when it removes real complexity or matches a proven pattern.
- Use semantic HTML and native controls before ARIA.
- Add concise comments only where the code would otherwise be difficult to understand.
- Do not fabricate missing business facts. Mark facts requiring verification.
- Do not modify, revert, or overwrite unrelated user work.
- Do not generate or modify public/.

After implementation:

- remove obsolete or temporary code introduced by the task;
- check for duplicate selectors, contradictory states, dead links, encoding damage, and unnecessary dependencies;
- run available formatters, content checks, and tests;
- run Hugo and SEO validation with an isolated destination;
- visually inspect affected UI at representative desktop and mobile widths when layout changes.

## Definition of Done

Work is complete only when:

- the requested behavior or content works at the responsible layer;
- customer-facing claims are accurate, qualified, and useful;
- all affected languages preserve equivalent information and risk boundaries;
- links, metadata, image treatment, accessibility, and performance have been considered;
- Hugo builds successfully for configured languages without new errors;
- no unrelated changes or public/ output were introduced;
- the result is no harder to understand, maintain, or extend than before;
- the final report states what changed, how it was verified, and what still requires human or supplier confirmation.