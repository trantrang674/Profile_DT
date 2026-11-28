# AGENTS.md - Antigravity Agent Guidelines

## Project Context
- **Name:** Content Marketing Portfolio (Profile_DT)
- **Primary Owner:** Dương Trang (Content Marketing Specialist)
- **Target Audience:** Recruiters, HR Managers, Marketing Directors, CEOs
- **Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+), Marked.js, Static Markdown CMS, GitHub Pages

## Universal Agent Rules
1. **Directory Integrity:**
   - All website code, assets, and project markdown files MUST reside strictly inside `frontend/`.
   - Never duplicate `.html` or assets into the root directory `Profile_DT/`.
   - Keep root clean with only agent configs (`GEMINI.md`, `AGENTS.md`), helper scripts (`run_preview.bat`), and `.github/`.

2. **Design System & Color Tokens:**
   - Backgrounds: `#ffffff`, `#f8fafc`
   - Primary Brand (Blue): `#0284c7`, `#0369a1`
   - Accent / CTA (Orange): `#f97316`, `#ea580c`
   - Dark Mode: **DISABLED**. Strictly Light Mode.
   - Font: `Plus Jakarta Sans`.

3. **Content Marketing Tone of Voice:**
   - Writing should be data-backed, empathetic, sharp, and conversion-oriented.
   - Use concrete KPIs (Reach, Engagement Rate, MQLs, Organic Traffic, AOV growth).
   - Language: Tiếng Việt (Vietnamese).

4. **Icons:**
   - Never use emoji or unicode symbols (🎯 ✍️ 📍 ★ ↗ → ↓ ✕ …) as UI icons.
   - Use only library icons: Lucide (`<i data-lucide="icon-name"></i>`, loaded from CDN in `index.html`; `assets/js/site.js` renders them, including elements added later by JS).
   - Icons inside inline SVG artwork: embed the Lucide path data (from `lucide-static`).
   - Emoji inside real social-media post captions are content, not icons, and may stay.
