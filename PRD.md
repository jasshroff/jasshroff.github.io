# Product Requirements Document (PRD)
## SGV Jewellers Website — Enhancement & Improvement Roadmap

**Repo:** [jasshroff/jasshroff.github.io](https://github.com/jasshroff/jasshroff.github.io)
**Live domain:** Custom domain via `CNAME` (referenced in repo as sgvjewellers.in)
**Doc owner:** [fill in]
**Status:** Draft v1.0
**Last updated:** 2026-08-14

> **Note on methodology:** This PRD is based on a public analysis of the repo's root-level files (`package.json`, `firebase.json`, `implementation.md`, `README.md`, workflow presence, language breakdown) — GitHub's directory browser blocks automated tools from listing `/src`, so component-level structure below is inferred from dependencies and business context rather than confirmed file-by-file. Treat the "Current State" section as a best-effort snapshot to validate with the team before prioritizing.

---

## 1. Executive Summary

SGV Jewellers' website is a React 18 + Vite single-page application deployed on GitHub Pages, using Firebase for data/storage and EmailJS for lead capture. The site already shows unusually strong investment in **AI-search / GEO (Generative Engine Optimization)** — a dedicated `implementation.md` playbook and an alternate `index-ai-optimized.html` homepage aimed at Schema.org markup, FAQ rich results, and AI Overview citations.

The core opportunity is to move from a **marketing/informational site** to a **conversion-oriented, trustworthy jewelry commerce platform** — while operationalizing the AI-SEO work that currently exists only as documentation, and closing gaps in engineering rigor (testing, TypeScript, security posture, performance, accessibility) typical of a fast-shipped small-business site.

---

## 2. Current State Analysis

### 2.1 Confirmed Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18.2, Vite 7 |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| Animation | Framer Motion 12 |
| Carousel/UI | Swiper 12, lucide-react icons |
| Backend-as-a-Service | Firebase 12 (Firestore + Storage; rules files present) |
| Forms/Lead capture | EmailJS (`@emailjs/browser`) |
| SEO | react-helmet-async, `helmet` (note: `helmet` is an Express/Node security middleware — likely a **misplaced/unused dependency** in a static SPA context, worth auditing) |
| Media | browser-image-compression, vite-imagetools, vite-plugin-svgo |
| Linting | ESLint 9 + flat config, react-hooks/react-refresh plugins |
| Hosting | GitHub Pages (custom domain via `CNAME`), `.github/workflows` CI present |
| Security policy | `SECURITY.md` present |

### 2.2 Business Context
The site represents **SGV Jewellers**, a jewelry retailer specializing in BIS-hallmarked 22K gold and certified diamond jewelry, wedding collections, and (per the implementation guide) old-jewelry buyback and custom orders — targeting the Indian market.

### 2.3 Notable Strengths Already Present
- Proactive AI/GEO-SEO strategy document (`implementation.md`) covering Organization/FAQPage/LocalBusiness JSON-LD schema, meta description and H1 rewrites, Search Console setup, and success metrics.
- An alternate AI-optimized homepage (`index-ai-optimized.html`) built for comparison against the live homepage.
- Firebase security rules files exist as first-class repo artifacts (`firestore.rules`, `storage.rules`) rather than left as Firebase Console defaults.
- Modern, current dependency versions (React Router 7, Vite 7, Tailwind 3.4, Firebase 12) — not a legacy/neglected codebase.

### 2.4 Likely Gaps (to validate with team)
- **No visible testing setup** (no Vitest/Jest/Testing Library in `devDependencies`).
- **No TypeScript** — plain `.jsx`, increasing risk of runtime type bugs as the app grows (especially around Firestore data shapes and pricing math).
- **Two parallel homepages** (`index.html` vs `index-ai-optimized.html`) — schema/SEO work appears to live in a file that may not be wired into the actual routed app, risking documentation/implementation drift.
- **`implementation.md` contains placeholder data** (`[YOUR FOUNDING YEAR]`, `[Store Address]`, etc.) — suggesting schema markup may not yet be live on production.
- **Client-side Firebase writes** are the norm for this stack; without Cloud Functions or App Check, pricing/inventory data and lead forms are exposed to client-side tampering risk unless rules are tightly scoped (need audit of `firestore.rules`/`storage.rules` content).
- **No CI-based quality gates visible** beyond a workflow presence (unclear if it runs lint/build/test/Lighthouse checks or just deploys).
- **Generic README** — still the default `create-vite` template, unhelpful for onboarding new contributors.
- **Accessibility, performance budgets, and analytics** are not evidenced in dependencies (no `web-vitals`, no visible a11y tooling, no GA4/analytics package).

---

## 3. Goals & Success Metrics

| Goal | Metric | Target (90 days) |
|---|---|---|
| Increase organic + AI-search visibility | AI Overview / SGE citations | 0 → 8–15 (per existing implementation.md targets) |
| Improve lead conversion | Contact/inquiry form completion rate | +20% |
| Improve page performance | Core Web Vitals (LCP, INP, CLS) | All "Good" in PageSpeed Insights |
| Reduce production bugs | Critical bugs post-release | <2/month |
| Improve code confidence | Test coverage on core flows (forms, pricing, catalog) | 60%+ |
| Strengthen data integrity | Firestore rule coverage | 100% of collections have explicit least-privilege rules |
| Accessibility compliance | WCAG 2.1 AA audit score | 90%+ (axe/Lighthouse) |

---

## 4. User Personas

1. **Prospective Bride/Groom's Family (Primary)** — researching wedding jewelry, comparing purity/pricing, wants trust signals (hallmark, certification, reviews) and easy store-visit booking.
2. **Existing/Repeat Customer** — wants to check gold rates, browse new collections, book appointments, possibly track a custom order or buyback appraisal.
3. **Mobile-first Local Searcher** — searches "jewellery shop near me" / uses Google/AI Overviews; needs fast-loading, schema-rich local business info.
4. **Store Staff / Admin (internal)** — may need a lightweight way to update gold rates, inventory highlights, or respond to leads (currently likely manual via Firebase Console).

---

## 5. Feature Roadmap

### 5.1 Phase 1 — Foundation & Trust (Weeks 1–3)
**Goal: Ship what's already been designed but not deployed; harden the base.**

- [ ] **Consolidate homepage**: Resolve `index.html` vs `index-ai-optimized.html` — merge the AI-optimized content/schema into the single production entry point rendered by the React app (schema should be injected via `react-helmet-async`, not a static duplicate HTML file).
- [ ] **Deploy structured data live**: Implement Organization, LocalBusiness (per store), and FAQPage JSON-LD with real data (replace all `[PLACEHOLDER]` values from `implementation.md`).
- [ ] **Fill real business data**: founding year, verified addresses, phone, hours, GIA/IGI/BIS certification badges, aggregate ratings pulled from an actual review source (Google Business Profile API or manual verified count — never fabricate ratings).
- [ ] **Google Search Console + Rich Results validation**: Submit sitemap, verify ownership, validate all schema via Rich Results Test.
- [ ] **Audit & tighten Firestore/Storage rules**: Confirm no collection allows unauthenticated writes; add rate-limiting patterns for public write paths (e.g., contact form submissions) via Firebase App Check.
- [ ] **Dependency audit**: Investigate/remove the `helmet` npm package if unused (it's Express middleware, not relevant to a static SPA — likely leftover or confused with `react-helmet-async`); run `npm audit`.
- [ ] **Rewrite README.md**: Replace default Vite template with actual project setup, env variables needed (Firebase config, EmailJS keys), deployment process, and contribution guide.

### 5.2 Phase 2 — Core Commerce & Trust Features (Weeks 4–8)
- [ ] **Live gold/silver rate widget**: Daily-updated rate display (via a scheduled Cloud Function pulling from a rate API), addressing the pricing-transparency FAQ already drafted (`Price = Gold Weight × Rate + Making Charges`).
- [ ] **Product/Collection catalog**: Structured catalog pages per category (gold, diamond, bridal, buyback) with `Product` schema markup, filterable by weight/purity/price range.
- [ ] **Appointment/store-visit booking**: Simple booking form (date/time/store location) feeding into Firestore + email/SMS confirmation, replacing/augmenting the EmailJS contact form.
- [ ] **Buyback/appraisal request flow**: Structured form (photo upload via `browser-image-compression` + Firebase Storage) letting customers request an old-jewelry appraisal online — directly extends the buyback FAQ content already written.
- [ ] **Multi-store locator with map**: Store list with LocalBusiness schema per location, Google Maps embed, hours, and click-to-call.
- [ ] **Testimonials/reviews section**: Pull and display real customer reviews (Google Business Profile integration or manual curation) tied to `aggregateRating` schema — this schema is already scaffolded but needs a real data source, not placeholders.

### 5.3 Phase 3 — Content & AI-Search Authority (Weeks 6–10, parallel track)
- [ ] **Pillar content pages**: Build the "22K Gold Guide" and other pillar articles referenced in the implementation plan, each with FAQPage schema and internal links from the homepage.
- [ ] **Blog/Content Calendar execution**: Stand up a lightweight CMS-less blog (Markdown-driven or headless CMS like Firebase-backed content collection) so non-engineers can publish SEO content without code deploys.
- [ ] **Internal linking architecture**: Systematic linking between catalog, pillar content, and FAQ sections.
- [ ] **Backlink/PR outreach tracking**: Not a code feature, but recommend a simple internal tracker (could be a private admin page or spreadsheet) — flagged here since it's called out as a required next step in `implementation.md`.

### 5.4 Phase 4 — Engineering Quality & Scale (Ongoing, start Week 2)
- [ ] **Testing infrastructure**: Add Vitest + React Testing Library; prioritize coverage on forms (contact, appointment, buyback), pricing calculations, and routing.
- [ ] **CI quality gates**: Extend `.github/workflows` to run lint + build + tests + Lighthouse CI on every PR before merge/deploy, not just deploy.
- [ ] **TypeScript migration (incremental)**: Start with new files and shared utils (pricing math, Firestore data models) using `.tsx`/`.ts`; full migration not required immediately, but scaffolding should be TS-first going forward.
- [ ] **Performance budget**: Set Lighthouse CI thresholds (LCP < 2.5s, CLS < 0.1, bundle size budget); audit image pipeline (are `vite-imagetools`/`vite-plugin-svgo` actually applied across all product images, or only some?).
- [ ] **Accessibility pass**: Run axe-core/Lighthouse a11y audits; fix color contrast (jewelry sites often use low-contrast gold/cream palettes), keyboard navigation for Swiper carousels, alt text for all product images (also an SEO win — already flagged in `implementation.md` checklist).
- [ ] **Error monitoring**: Add Sentry (or Firebase Crashlytics equivalent for web) for production error visibility — currently no evidence of error tracking.
- [ ] **Analytics**: Add GA4 (or privacy-friendly alternative like Plausible) to actually measure the traffic/conversion metrics `implementation.md` targets — currently no analytics dependency visible.

### 5.5 Phase 5 — Growth & Personalization (3–6 months)
- [ ] **Wishlist/favorites** (Firestore-backed, works for anonymous + logged-in users via Firebase Auth).
- [ ] **WhatsApp Business integration**: High-impact for Indian jewelry retail — click-to-WhatsApp CTAs for inquiries, common in this vertical.
- [ ] **Multi-language support** (Hindi/regional language) via `react-i18next`, given the target market.
- [ ] **Admin dashboard**: Internal-only route (Firebase Auth + custom claims) for staff to update gold rates, add products, and view leads without touching Firebase Console directly.
- [ ] **AI chat/FAQ assistant**: Given the heavy FAQ-schema investment, consider a lightweight on-site assistant surfacing the same FAQ content conversationally.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | LCP < 2.5s on 4G mobile; total JS bundle < 250KB gzipped for initial route |
| **SEO/GEO** | 100% of pages have unique title/meta description; all schema types validate in Google Rich Results Test with zero errors |
| **Security** | No secrets in client bundle (audit `.env` usage); Firestore/Storage rules deny-by-default; CSP headers configured at hosting layer |
| **Accessibility** | WCAG 2.1 AA minimum; all interactive elements keyboard-navigable |
| **Reliability** | 99.9% uptime (GitHub Pages SLA-dependent); form submissions have client + server-side validation with graceful failure states |
| **Data privacy** | Buyback/appointment forms handling PII (name, phone, photos) must have a documented retention/deletion policy, especially given `storage.rules` governs uploaded jewelry photos |
| **Browser support** | Latest 2 versions of Chrome, Safari, Edge, Firefox; iOS Safari priority given mobile-first jewelry shopping behavior |

---

## 7. Risks & Open Questions

1. **Schema/content drift risk**: `implementation.md` describes work that may not be live — confirm production status before building Phase 2/3 features on top of assumed-live schema.
2. **`helmet` dependency**: Confirm whether this is intentional (e.g., used in a Firebase Cloud Function/Express context not visible in this repo) or an accidental/unused install — remove if dead weight.
3. **Firestore security posture unknown**: The actual contents of `firestore.rules`/`storage.rules` need a security review before Phase 2 features (uploads, bookings) expand what's writable from the client.
4. **Single-repo, single-maintainer risk**: No visible CODEOWNERS, contribution guidelines, or multiple contributors (per repo Insights) — recommend documenting deployment/rollback runbooks regardless of team size.
5. **GitHub Pages hosting limits**: No server-side rendering, no server-side redirects/headers by default — confirm whether custom domain uses a CDN/Cloudflare in front for CSP headers, caching, and image optimization, or whether this should move to Firebase Hosting (already using Firebase elsewhere) for tighter integration with Firestore/Storage rules and Cloud Functions.

---

## 8. Suggested Prioritization (RICE-style, high level)

| Initiative | Reach | Impact | Confidence | Effort | Priority |
|---|---|---|---|---|---|
| Deploy live schema markup w/ real data | High | High | High | Low | **P0** |
| Firestore/Storage rules security audit | High | High | High | Low | **P0** |
| Live gold rate widget | High | High | Med | Med | **P1** |
| Testing + CI quality gates | Med | High | High | Med | **P1** |
| Appointment/buyback booking flow | High | High | Med | Med | **P1** |
| Analytics + error monitoring | Med | Med | High | Low | **P1** |
| Pillar content + blog | Med | Med | Med | Med | **P2** |
| WhatsApp integration | High | Med | Med | Low | **P2** |
| TypeScript migration | Low | Med | High | High | **P3** |
| Admin dashboard | Med | Med | Med | High | **P3** |

---

## 9. Next Steps
1. Validate the "Current State" and "Gaps" sections against the actual `/src` structure and live production site (this analysis was limited to public root-level files).
2. Confirm production status of AI-SEO schema work — is `implementation.md` fully executed or partially?
3. Pull actual business data (real founding year, addresses, certifications, review counts) to replace placeholders before shipping Phase 1.
4. Assign owners per phase and convert this roadmap into GitHub Issues/Projects for tracking.
