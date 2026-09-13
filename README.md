# DSCG Wedding Websites — Site 1: DSCG Wedding Portal

The **DSCG Wedding Portal** is the dedicated commercial sales, package comparison, and demo exploration front door for **Dark Star Consulting Group's Wedding Websites** offering.

## Ecosystem Architecture

This repository is **Site 1 of 5** in the authoritative DSCG Wedding Websites ecosystem:

1. **Site 1: DSCG Wedding Portal** *(This Repository)*
2. **Site 2: Wedding Essential Demo (★)**
3. **Site 3: Wedding Website Demo (★★)**
4. **Site 4: Wedding Weekend / Destination Demo (★★★)**
5. **Site 5: DSCG Wedding Intake**

## Authorized Products & Starting Pricing

- **Wedding Essential (★)**: Starting at **$495** — Straightforward, elegant wedding presence.
- **Wedding Website (★★)**: Starting at **$795** — The complete general-purpose wedding website for most couples.
- **Wedding Weekend / Destination (★★★)**: Starting at **$1,195** — Expanded web experience for multi-day and destination celebrations.

## Demo Model: 3 Demos × 5 Selectable Styles = 15 Visual Experiences

Each functional demo site (Sites 2, 3, 4) features one fictional wedding rendered across five substantially different visual directions (typography, composition, image presentation, visual rhythm, and mood), demonstrating design versatility rather than generic template swapping.

## Destination Configuration

Destination links to Sites 2–5 are centrally managed in:
`src/scripts/config.js`

```javascript
export const CONFIG = {
  ESSENTIAL_DEMO_URL: '',
  WEDDING_WEBSITE_DEMO_URL: '',
  WEEKEND_DESTINATION_DEMO_URL: '',
  WEDDING_INTAKE_URL: '',
  // ...
};
```
When these URLs are configured, visitors are directed to the live deployments. In placeholder mode, an accessible modal dialog provides preview metadata without broken 404 links.

## Development & Build

- **Development Server**: `npm run dev`
- **Production Build**: `npm run build` (outputs to `dist/`)
- **Preview Build**: `npm run preview`
- **Hosting Target**: Netlify (preconfigured with `netlify.toml`)

## Quality & Complexity Boundaries

- Strict **★★★ complexity ceiling** (no unrequested booking engines, guest SaaS portals, or software overhead).
- Mobile-first, fully responsive, and accessible design.
- Respects `prefers-reduced-motion`.
