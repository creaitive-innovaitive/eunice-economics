# Eunice's A-Level Economics Tutoring Site

## Purpose
A site the student can open on any device to learn and revise Edexcel A-Level Economics (Specification A). Built and run by the tutor; the student only reads and practises.

## Format
A static website: plain HTML, CSS and a little JavaScript, no framework and no build step. Chosen over an artifact because the student needs a stable link that can be updated as we go, and over a web app because nothing needs a server or logins. Deploy on GitHub Pages under the creaitive-innovaitive account, so the student just bookmarks a URL. Progress (quiz scores, ticked topics) is saved in the browser with localStorage.

## Source material
Everything lives in `../Exam Board Documents/Edexcel/`: specification PDFs, Hewison and Joad textbooks, knowledge organisers, past papers 2017 to 2025 (plus AS), the Theme 3 and Theme 4 key concept docs, the required charts list, the Paper 3 25-mark essay guide and the long answer question guide. Content on the site is written from these, not copied verbatim.

## Structure
- `Theme 3/` Business behaviour and the labour market. First topic block: revenue, costs and profits.
- `Exam Technique/` Chain of reasoning for essay questions, built around the Paper 3 25-mark essay guide and the long answer question guide.
- Later: other themes get their own folders in the same pattern.

## Starting brief (from the dad, Eugine)
Chain of reasoning for essay questions, and revision for Theme 3 topics (revenue, costs and profits).

## Planned content
Theme 3, revenue, costs and profits: short notes per spec point, worked diagrams (the required charts), key term flashcards, quick quizzes, and past paper questions with mark scheme points.

Exam technique: the chain of reasoning method (point, explain, link, evaluate, judge) with worked examples, annotated model answers, a paragraph builder for practice, and timed essay prompts drawn from past papers.

## Rules
- Educational, exam-focused tone. Plain language, no filler.
- Every claim tied to the spec or textbook.
- Diagrams are drawn in SVG so they stay sharp on phones.
- Mobile first: the student will likely use a phone or tablet.

## Student
Eunice, Year 13 (second year of A-Level Economics). Exams April, May and June 2027, so content is paced backwards from those dates. The website is the priority; downloadable lessons are secondary.

## Interactive pages
Lessons should feel like Claude artifacts, built into the site with inline SVG and vanilla JavaScript:
- Step-by-step diagram walkthroughs: next/back buttons reveal each stage of a chart with a caption (e.g. cost curves, profit maximisation at MC = MR).
- Sliders and toggles that move curves live (e.g. change price or fixed costs and watch revenue, cost and profit change).
- Click-to-reveal chain of reasoning builders for essay paragraphs.
- Flashcards and short quizzes with instant feedback.

## PDF downloads
Each lesson page has a "Download PDF" button that uses the browser's print-to-PDF with a print stylesheet. In print mode interactives collapse into a static version (every diagram step shown in sequence, answers visible), so the PDF is a clean revision handout. No server needed.

## Standalone PDF resources
Separate from the per-page "Download PDF" button, some topics also get purpose-made PDFs, modelled on the Classnotes, CBA and Keywords Worksheet resources in the SIS Stuff Resource Website. Examples: class notes, keywords worksheets, exam question packs with mark scheme points. These are designed as PDFs (not print-outs of the page), stored in each topic folder under a `pdfs/` subfolder (e.g. `Theme 3/pdfs/`), and linked from a "Downloads" section on the relevant page.

## Downloads page
`downloads.html` lists every PDF we produce, grouped by Edexcel textbook chapter (Theme 3 is chapters 17 to 23: business growth; revenues, costs, profits and objectives; perfect competition and monopoly; monopolistic competition and oligopoly; pricing strategies and contestable markets; the labour market; government intervention to promote competition). Exam technique documents sit in their own group. The page reads `downloads.json`, so adding a document means adding one entry `{ "name", "path", "type" }` under the right chapter; no HTML edits. Later themes get added to the same JSON using their chapter numbers from the textbook.

## Site build (v1)
Files: `index.html` (cover, hero, nav, Theme 3 / Exam technique tabs), `style.css`, `site.js`, `downloads.html` + `downloads.json`, `chapters/chapter-17..23.html`, `techniques/*.html`, `images/*.svg`, `site-data.json` (tile list). The cover shows once per browser session (not on refresh) and dissolves on "Enter Here". Lesson pages have collapsible sub-topics with Expand all / Collapse all / Download PDF. Sub-topic content is placeholder until written. Exam technique pages: command words, chain of reasoning, evaluation, 25-mark essays, diagrams, data response.

## Spec alignment (Theme 3)
Pages follow the Edexcel Economics A specification, not a textbook, because the student's textbook is not confirmed. Theme 3 has eight pages in `theme-3/`: 3.1 Business growth; 3.2 and 3.3 Business objectives, revenues, costs and profits (the fully written page); 3.4 in four parts (efficiency, perfect and monopolistic competition; oligopoly; monopoly and price discrimination; monopsony and contestability); 3.5 Labour market; 3.6 Government intervention. Each unwritten page lists the spec points to be covered. Downloads are keyed by page slug in `downloads.json`; PDFs are named by spec section (for example `3.2-3.3 - Class Notes.pdf`). The old `chapters/chapter-18.html` is a redirect kept so any shared link still works. Aligning to the student's textbook chapters may be added later.
