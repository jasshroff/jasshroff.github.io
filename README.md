# SGV Jewellers Website, CRM Portal and RAG Chatbot

The website for **Shree Gopaldas Vallabhdas Jewellers (SGV Jewellers)**, a jewellery business in Burhanpur, Madhya Pradesh. This repository contains the public website, product catalog, editorial blog, customer inquiry form, careers application flow, inventory and HR dashboards, a CRM preview, and a customer-support chatbot.

- Configured domain: [sgvjewellers.in](https://sgvjewellers.in)
- Repository: [jasshroff/jasshroff.github.io](https://github.com/jasshroff/jasshroff.github.io)
- Application: React single-page application (SPA), built with Vite
- Hosting: GitHub Pages
- Backend services: Firebase Authentication, Cloud Firestore and Firebase Storage
- Scope: the code present in this repository, not every feature proposed in older planning documents

> **Important:** The CRM is currently a demo/partially connected dashboard, not a complete website CMS. The chatbot includes a browser-side, keyword-based RAG-style pipeline and an optional remote AI endpoint. There is no bundled LLM server, vector database, live gold-rate feed, inventory verification service or guarantee of hallucination-free answers. Read [CRM Portal](#crm-portal) and [Guardrails and Limitations](#guardrails-and-limitations) before production use.

## Contents

1. [Features and Status](#features-and-status)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Local Setup](#local-setup)
6. [Environment Variables](#environment-variables)
7. [Routes and Access](#routes-and-access)
8. [Firebase Setup and Data](#firebase-setup-and-data)
9. [EmailJS, Product Media and Maps](#emailjs-product-media-and-maps)
10. [RAG Customer-Support Chatbot](#rag-customer-support-chatbot)
11. [CRM Portal](#crm-portal)
12. [Content and Website Maintenance](#content-and-website-maintenance)
13. [SEO, Analytics and Assets](#seo-analytics-and-assets)
14. [Build and Deployment](#build-and-deployment)
15. [Verification](#verification)
16. [Troubleshooting](#troubleshooting)
17. [Security and Privacy](#security-and-privacy)
18. [Remaining Production Work](#remaining-production-work)
19. [Contributing and Related Documents](#contributing-and-related-documents)
20. [Ownership and License](#ownership-and-license)

## Features and Status

| Area | Implemented behavior | Status / boundary |
| --- | --- | --- |
| Public website | Home, business history, collections, best sellers, testimonials, contact details and responsive navigation | Largely maintained in source files |
| Catalog | Category filtering, images and product-specific inquiry links | Reads Firestore on load; falls back to nine bundled products for an empty collection or failed read |
| Inquiries | Contact form, call, WhatsApp and directions links | EmailJS email only; the contact form does not create a CRM/Firestore request |
| Blog | Search, category filters, articles, related posts, sharing, metadata and structured data | Nine bundled articles; publishing requires a code change and deployment |
| Careers | Three bundled job openings and signed-in application flow | Openings are not managed through CRM |
| Applications | Resume, Aadhaar images, photograph, applicant details and consent | Firebase Storage uploads and a Firestore application record |
| Applicant profile | Application status and HR notes | Intended to show owned records; see query limitations below |
| Inventory dashboard | Add products, list products and delete products | Firestore-backed; no product-edit UI or stock-management system |
| HR dashboard | Search/filter applications, update status, save notes and export | Persisted changes; CSV or HTML-table `.xls` export, not native `.xlsx` |
| CRM portal | Request inbox, filters, status selectors, CSV export, blog queue, action queue and campaign preview | Session-only changes and sample data remain in the protected portal too |
| Chatbot | Warm Hinglish templates, local retrieval, source links, handoff and optional API | Static knowledge by default; no automatic live-business-system access |
| SEO / analytics | Metadata, JSON-LD, sitemap, robots, manifest and Google Analytics route tracking | Manually maintained; no analytics dashboard or offline-capable PWA |

There is no checkout, payment gateway, shopping cart, order-tracking backend, appointment-booking backend, automatic WhatsApp message ingestion or email inbox synchronization in this repository.

## Technology Stack

Major versions below are declared in [package.json](package.json). [package-lock.json](package-lock.json) records exact resolved versions.

| Layer | Technology |
| --- | --- |
| UI | React 18, React DOM 18, JavaScript/JSX |
| Build | Vite 7, `@vitejs/plugin-react` |
| Routing | React Router DOM 7 with `BrowserRouter` |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Animation / carousels | Framer Motion 12, Swiper 12 |
| Icons | Lucide React |
| Authentication / data | Firebase 12 web SDK |
| Email | `@emailjs/browser` |
| Page metadata | `react-helmet-async` |
| Image tooling | Native lazy loading, Vite imagetools and SVGO plugins |
| Quality | ESLint 9, React Hooks and React Refresh rules |
| CI / hosting | GitHub Actions, GitHub Pages, CodeQL |
| Chatbot retrieval | Repository-owned lexical scoring, intent rules and curated knowledge |

`helmet` and `browser-image-compression` are installed but not wired into current application flows. Installing `helmet` does not provide HTTP security headers for this static SPA.

## Architecture

```text
Browser: React + React Router + shared layout
  |
  +-- Public pages and bundled business/blog content
  +-- Firebase Authentication --> session and role claims
  +-- Cloud Firestore ---------> products and jobApplications
  +-- Firebase Storage -------> applicant documents
  +-- EmailJS ----------------> contact email / application confirmation
  +-- ImgBB ------------------> inventory images
  +-- Chatbot widget
        +-- Business knowledge + blog section index
        +-- Intent detection + retrieval + scope checks
        +-- Local answer OR optional POST to a remote AI endpoint
        +-- Source-page links and call/WhatsApp handoff

GitHub Actions --> Vite build --> dist/ --> GitHub Pages
```

Firebase, EmailJS and ImgBB are external services accessed by the browser. The optional chatbot endpoint must be implemented and hosted separately. There is no bundled Express server, Firebase Cloud Function, Firebase Admin SDK service or local database server.

The entire app is wrapped in `AuthProvider`, including public pages and the CRM demo. Valid Firebase configuration is therefore required even for a public-site preview or the local chatbot.

## Project Structure

```text
.
|-- src/
|   |-- main.jsx                    # React, HelmetProvider, error boundary
|   |-- App.jsx                     # Routes and role gates
|   |-- firebase.js                 # Firebase client initialization
|   |-- index.css                   # Global styles
|   |-- components/
|   |   |-- Layout.jsx              # Navbar, footer, outlet and chatbot
|   |   |-- ChatbotWidget.jsx        # Chat UI and request state
|   |   |-- ProtectedRoute.jsx       # Client-side access gate
|   |   |-- Hero.jsx                 # Homepage carousel
|   |   |-- HomeSections.jsx         # Collections, featured content and CTAs
|   |   |-- OptimizedImage.jsx       # Native img wrapper
|   |   |-- ScrollToTop.jsx          # Scroll reset and GA route tracking
|   |   `-- ...                     # Navbar, Footer, ErrorBoundary
|   |-- contexts/AuthContext.jsx    # Auth session and token claims
|   |-- data/
|   |   |-- blogData.js              # Articles, categories and lookup helpers
|   |   `-- chatbotKnowledge.js      # Business profile, prompts and knowledge
|   |-- utils/
|   |   |-- authClaims.js            # Roles and email overrides
|   |   `-- ragSearch.js             # Retrieval, answers and API integration
|   `-- pages/                      # Public, applicant, inventory, HR and CRM
|-- public/
|   |-- images/                     # Brand, product, team and optimized assets
|   |-- robots.txt
|   |-- sitemap.xml
|   |-- manifest.json
|   `-- sgv.svg
|-- .github/workflows/
|   |-- deploy.yml                  # GitHub Pages build/deployment
|   `-- codeql.yml                  # Security analysis
|-- .env.example                    # Configuration template
|-- firestore.rules
|-- storage.rules
|-- firebase.json                   # Rules, not Firebase Hosting
|-- index.html                      # Active entry point
|-- index-ai-optimized.html          # Alternate/reference HTML
|-- CNAME                           # Intended custom domain
|-- vite.config.js
|-- tailwind.config.js
|-- postcss.config.js
|-- eslint.config.js
|-- package.json
|-- package-lock.json
`-- README.md and planning/security documents
```

`replace_theme.cjs` is a one-off source-rewriting utility, not an application entry point or required setup step. Do not run it during normal installation.

## Local Setup

### Prerequisites

- Git and npm.
- Node.js satisfying the locked Vite requirement: `^20.19.0 || >=22.12.0`.
- A Firebase project with Authentication, Firestore and Storage.
- EmailJS configuration for email features and an ImgBB key for inventory uploads.
- A separately hosted AI endpoint only if remote chatbot responses are needed.

### Install and Run

```bash
git clone https://github.com/jasshroff/jasshroff.github.io.git
cd jasshroff.github.io
npm ci --legacy-peer-deps
cp .env.example .env.local
```

Populate `.env.local` using the reference below, then start:

```bash
npm run dev
```

Vite normally uses `http://localhost:5173`; use the terminal's URL if that port is occupied. Open `/admin/crm-demo` on that server to preview CRM without staff login. Firebase initialization is still required.

The `--legacy-peer-deps` flag follows the repository's deployment install behavior. Use the committed npm lockfile; do not mix package-manager lockfiles or regenerate dependencies just to run the app.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run lint` | ESLint checks |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve an already generated build locally |

```bash
npm run build
npm run preview
```

There is no `npm test`, backend-start script, migration script or chatbot-ingestion script.

## Environment Variables

Vite reads `.env.local` and injects `VITE_*` values into browser code at build time. Restart development after changes; rebuild/redeploy for production changes.

> **Every `VITE_*` value is public browser configuration.** GitHub Secrets protect values before building, not after injection into the bundle. Never put an LLM provider secret, service-account credential or private email-service key in a `VITE_*` variable.

| Variable | Purpose | Required when |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | Running the app |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | App/auth configuration |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project | Firebase data features |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web configuration | Configuring Firebase |
| `VITE_FIREBASE_APP_ID` | Firebase web app identifier | Configuring Firebase |
| `VITE_EMAILJS_SERVICE_ID` | Email service | Contact/confirmation email |
| `VITE_EMAILJS_TEMPLATE_ID` | Contact template | Contact email |
| `VITE_EMAILJS_CAREERS_TEMPLATE_ID` | Applicant confirmation template | Optional careers email |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS browser public key | EmailJS features |
| `VITE_IMGBB_API_KEY` | Product image upload | Adding inventory |
| `VITE_CHATBOT_API_URL` | Remote AI/RAG endpoint | Optional remote answers |

Current configuration gaps:

- `.env.example` lacks `VITE_IMGBB_API_KEY`; add it locally for inventory uploads.
- `src/firebase.js` hardcodes `shreegopaldasvallabhdas-3c81c.firebasestorage.app` as the Storage bucket. Update this source value when using another Firebase project.
- CI passes `VITE_FIREBASE_STORAGE_BUCKET`, but the app does not read it. That variable alone cannot change the bucket.
- CI omits `VITE_EMAILJS_CAREERS_TEMPLATE_ID` and `VITE_CHATBOT_API_URL`. Add them to both GitHub Secrets and the build step's `env` mapping when needed.
- Maps and Google Analytics settings are embedded in HTML/source, not env variables.

Leave `VITE_CHATBOT_API_URL` empty for local chatbot mode. No LLM account or key is needed for that mode.

## Routes and Access

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/about-us` | About/business history | Public |
| `/catalog` | Collections | Public |
| `/contact-us` | Contact/showroom | Public |
| `/contact-us?product=PRODUCT_TITLE` | Prefilled inquiry | Public |
| `/blog` | Article listing | Public |
| `/blog/:slug` | Article | Public |
| `/careers` | Openings | Public |
| `/careers/apply` | Application entry | Public route; form needs a signed-in user |
| `/careers/apply?role=ROLE_NAME` | Preselected application role | Same sign-in requirement |
| `/login` | Staff email/password login | Public entry; unauthorized accounts rejected |
| `/profile` | Applicant profile | Any signed-in user |
| `/admin` | Inventory | `admin` or `staff` |
| `/admin/hr` | HR | `admin` or `hr` |
| `/admin/crm` | Protected CRM | `admin`, `staff` or `hr` |
| `/admin/crm-demo` | CRM sample preview | Public |
| `/about`, `/contact`, `/blogs` | Legacy aliases | Redirect to canonical routes |
| Unmatched path | Not found | Public |

### Authentication and Roles

- Staff use email/password at `/login`. Applicants are offered Google sign-in from the application page; an existing authenticated session also satisfies its form gate.
- Frontend helpers accept boolean claims such as `{ "hr": true }`, a string `role`, or a `roles` array. An `admin` claim also satisfies staff/HR access.
- `sgvjewellers1938@gmail.com` is a primary-admin override in frontend helpers and backend rules.
- `staffsgvjewellers@gmail.com` has a frontend staff override but **no matching Firestore override**. Its backend writes still need trusted role claims.
- Provision accounts/claims in a trusted Firebase administration environment. No role-assignment utility is included; visitors must not assign their own roles.
- Refresh tokens or sign out/in after claim changes. `AuthContext` loads claims and exposes `refreshAuthClaims`.
- Frontend route access is not backend authorization: Firestore and Storage rules must independently permit each operation.

## Firebase Setup and Data

### Setup

1. Create/select a Firebase project and register a web app.
2. Put that web app's configuration in the Firebase env variables.
3. Enable Email/Password and Google auth providers for the relevant flows.
4. Configure authorized auth domains for local/deployed hosts and verify popup sign-in.
5. Create Firestore/Storage and check the hardcoded bucket.
6. Provision staff accounts/claims and deploy rules to the intended project.

With the Firebase CLI available, target the project explicitly:

```bash
firebase login
firebase deploy --only firestore:rules,storage --project YOUR_FIREBASE_PROJECT_ID
```

The CLI is not a project dependency. There is no committed `.firebaserc`, emulator configuration or indexes file. `firebase.json` configures rules only; the website currently deploys through GitHub Pages, not Firebase Hosting.

### Firestore Collections

#### `products/{productId}`

| Field | Type / value |
| --- | --- |
| `title` | Product title string |
| `category` | `Gold`, `Antique`, `Necklace`, `Rings`, `Bangles`, `Diamond`, `Silver` |
| `type` | `standard`, `large`, `wide`, `vertical` display style |
| `image` | Uploaded image URL |
| `createdAt` | Firestore server timestamp |
| `createdBy` | Staff email |

Inventory writes these fields; readers attach Firestore's document ID as `id`. There is no verified price, weight, SKU, quantity or rate-history schema. Catalog uses one-time `getDocs`, not a real-time listener.

#### `jobApplications/{applicationId}`

- Identity: `fullName`, `fatherName`, `dob`, `gender`, `maritalStatus`.
- Contact/address: `mobile`, `whatsapp`, `email`, `address`, `city`, `state`, `pincode`.
- Employment: `qualification`, `experience`, `previousCompany`, `skills`, `expectedSalary`, `motivation`, `joiningDate`, `appliedRole`.
- Attachments: `resumeUrl`, `aadharFrontUrl`, `aadharBackUrl`, `photoUrl`.
- Ownership/audit: `applicantUid`, `consent`, `createdAt`, and `updatedAt` after HR edits.
- Workflow: `status` initially `Pending`, `adminNotes` initially empty.

HR statuses are `Pending`, `Shortlisted`, `Rejected`, `Interview Scheduled` and `Selected`. Status/note edits persist with `updateDoc`.

The profile queries by `email`, while applicant-read rules require `applicantUid` ownership. Firestore rules are not filters; align the applicant query with the UID rule before relying on self-service visibility. The profile also displays `adminNotes` to applicants: these are not confidential internal-only notes.

#### `websiteRequests/{requestId}`

CRM attempts to read `customer`, `channel`, `topic`, `priority`, `status`, `owner` and `date` from this collection. It is **not a functioning request store**:

- No contact form, chatbot or WhatsApp integration writes these records.
- There is no explicit collection rule; the deny-all fallback blocks access.
- Request status edits only change React state.
- Manually adding documents does not resolve permissions or connect customer channels.

### Rule Boundaries

| Resource | Read | Write |
| --- | --- | --- |
| Products | Public | Staff/admin claims or primary-admin email |
| Applications | HR/admin or owning applicant | Applicant creation with matching UID/email and `Pending`; HR/admin updates; deletion denied |
| Application files | HR/admin or owner through rules-controlled SDK access | Owner, subject to size/MIME rules |
| Other documents/paths | Denied | Denied |

Claims-only `staff` cannot read all HR applications, and claims-only `hr` cannot manage products. CRM reads products and applications together, so its broader route gate does not guarantee successful live-data loading.

### Applicant Files

```text
applications/{applicantUid}/{timestamp}/{fileName}
```

Resume, Aadhaar front/back and photograph upload sequentially before the Firestore document is saved. The form accepts `.pdf`, `.doc`, `.docx` resumes and `.jpg`, `.jpeg`, `.png`, `.webp` images.

Browser validation accepts up to 5 MiB, but Storage rules require **strictly less than 5 MiB**. An exactly-at-limit file can fail backend upload. Rules also check ownership and MIME type. Uploads and the Firestore write are not atomic, so failures can leave orphaned files.

## EmailJS, Product Media and Maps

### Email Templates

Contact uses `emailjs.sendForm` with these exact parameter names:

| Parameter | Meaning |
| --- | --- |
| `user_name` | Customer name |
| `user_phone` | Phone |
| `user_email` | Email |
| `message` | Inquiry, optionally product-prefilled |

Careers confirmation uses `emailjs.send` with `to_email`, `applicant_name`, `applied_role` and `reply_to`. Configure recipients/staff copies in the provider's template/service; there is no inbox or guaranteed dual-recipient delivery logic.

Missing/failed careers email does not undo a saved application. Contact delivery failures show a failed submission. Apply appropriate provider-side origin restrictions and abuse controls for browser email.

### Product Uploads

Inventory sends `FormData` with an `image` field to ImgBB, then saves the returned URL in Firestore. Supply `VITE_IMGBB_API_KEY` in local and CI build configuration.

The picker advertises images/videos, but the implementation uses an image-hosting integration with no dedicated video upload path. Do not assume MP4 works. Deleting a Firestore product does not delete its remotely hosted image. Bundled catalog fallback cards are separate from uploaded records.

### Maps

`index.html` loads Google Maps using a browser-visible key; `Contact.jsx` creates the map/marker. Restrict that key to intended origins/APIs and review quota/billing. Directions and marker coordinates are configured separately. The map can remain blank if the script is unavailable when the contact effect runs.

## RAG Customer-Support Chatbot

### Purpose and Availability

The floating **SGV AI Assistant** handles collections, bridal/custom jewellery, quality/hallmarking, showroom contact/hours, pricing methodology, care, after-sales policies and careers. Its UI and deterministic templates use polite Indian Hinglish, commonly beginning with **"Namaste ji"**.

`Layout.jsx` includes it on public and dashboard routes. It is available whenever the site loads, without a scheduled shift. "24/7" means frontend self-service availability, not an uptime SLA or round-the-clock human support. Local answers need no AI server, but the app needs valid Firebase initialization.

### Files

| File | Responsibility |
| --- | --- |
| [ChatbotWidget.jsx](src/components/ChatbotWidget.jsx) | Input, prompts, bubbles, thinking state, sources and contact actions |
| [chatbotKnowledge.js](src/data/chatbotKnowledge.js) | Business profile, suggested questions and nine curated documents |
| [blogData.js](src/data/blogData.js) | Additional indexed article content |
| [ragSearch.js](src/utils/ragSearch.js) | Indexing, retrieval, intents, scope checks, templates and API calls |

### Local Pipeline

1. **Index:** Combine curated knowledge with blog summaries and sections. Blog bodies split at `##` headings; stripped sections longer than 80 characters become documents.
2. **Normalize:** Lowercase, normalize accents, retain Latin letters/numbers and remove English/Hinglish stop words. This is not semantic multilingual tokenization.
3. **Expand:** Manual mappings include `daam`/`bhav` to pricing, `kidhar` to location, and `bis` to hallmark/HUID/purity.
4. **Retrieve:** Score overlap using log-scaled frequency plus title/keyword boosts. `getChatbotResponse` retrieves up to five documents; the retrieval helper defaults to four.
5. **Classify:** Ordered regex rules detect greeting, live, contact, hours, pricing, quality, bridal, policy, collections, careers or general intent.
6. **Scope-check:** General queries need allowed business terms, documents and a top score of at least `4`; out-of-scope questions receive a polite refusal.
7. **Answer:** Use Hinglish templates/source sentences or the optional endpoint. General extracted sentences can remain English despite a Hinglish introduction.
8. **Link/handoff:** Show up to three sources plus call/WhatsApp. Recognized intents can use preferred source links rather than top retrieved documents.

Local mode is a **retrieval-augmented, rule-based assistant**, not LLM generation. No embeddings, vector database, PDF ingestion, web crawling, automatic refresh jobs or model reranker is included.

### Real-Time Questions

Rules attempt to detect today's rates, current stock, availability, offers, booking and delivery/order status. Without a verified remote answer, the bot declines to guess and offers showroom contact.

```text
Visitor: Showroom kaha hai?
Assistant: Namaste ji, zaroor. SGV Jewellers ke details yeh hain: ...

Visitor: Aaj gold rate kya hai?
Assistant: Namaste ji, live rate, current stock, availability, offers ya
same-day delivery jaise details real-time change hote hain.
Main guess karke answer nahi dunga. ...

Visitor: Who won the cricket match?
Assistant: Namaste ji, is question par main verified SGV Jewellers
context ke bahar answer nahi de sakta ...
```

The bot does **not** read Firestore products/HR records, fetch metal rates, check holiday hours, track orders, create leads, book appointments or automatically forward chats to CRM. Contact links are handoff actions, not automated support integrations.

### Optional Remote Endpoint

Set `VITE_CHATBOT_API_URL` to a separately hosted HTTPS endpoint. The client sends `POST` JSON with `Content-Type: application/json`, no auth token and no streaming protocol.

Illustrative payload below: actual `context` contains retrieved documents and `instructions` is the longer policy string in `buildRagPayload`.

```json
{
  "message": "Aaj gold rate kya hai?",
  "detectedIntent": "live",
  "requiresLiveVerification": true,
  "history": [
    { "role": "user", "content": "Aaj gold rate kya hai?" }
  ],
  "business": {
    "name": "Shree Gopaldas Vallabhdas Jewellers",
    "phone": "+91 917-955-9000",
    "email": "sgvjewellers1938@gmail.com",
    "address": "17, Shreenath Sadan, Pandumal Chouraha, Tilak Marg Road, Burhanpur (M.P) - 450331",
    "hours": "Mon - Sun: 10:00 AM - 9:00 PM"
  },
  "context": [
    {
      "id": "pricing-gold-rate",
      "title": "Pricing and Gold Rates",
      "route": "/blog/complete-guide-22k-gold-jewellery",
      "content": "Gold rates change daily. Contact the showroom for verified rates."
    }
  ],
  "instructions": "Use only SGV context or verified live data; answer politely in Hinglish."
}
```

History contains at most eight entries reduced to `role`/`content`. The widget includes the newest user entry in both `message` and `history`; avoid duplicating it when constructing model messages. Local answers do not use history to resolve follow-up questions.

Compatible response shape:

```json
{
  "answer": "Namaste ji, yeh SGV website context se mili hui information hai...",
  "outOfScope": false,
  "verifiedLiveData": false
}
```

| Field / outcome | Client behavior |
| --- | --- |
| `answer` | Preferred answer; return a nonempty string |
| `message` / `response` | Alternative answer names accepted |
| `outOfScope: true` | Replaces endpoint text with the local refusal |
| `verifiedLiveData: true` | Required for an answer classified as `live` |
| Missing/non-true live verification | Local call/WhatsApp handoff instead of live endpoint text |
| Custom `sources` / metadata | Ignored; displayed links are selected locally |
| Non-2xx, JSON/network error, missing answer | Local fallback |

There is no explicit timeout/abort mechanism: a hanging request can delay fallback indefinitely. The endpoint must allow intended origins through CORS and support the JSON preflight where applicable.

Keep provider keys on the server. Implement server-owned knowledge, scope enforcement, payload validation, rate limiting and genuine live-source verification there. This repository supplies only the browser integration contract, not that backend.

### Guardrails and Limitations

Curated knowledge, general-query thresholds, templates, live handoff and endpoint refusal flags reduce unsupported answers. They are **not a security boundary or zero-hallucination guarantee**:

- Recognized intents bypass general scope thresholds. Unrelated questions containing `gold`, `time` or `work` can be misclassified.
- Greeting detection runs first: `Hello, aaj gold rate kya hai?` becomes `greeting`, not `live`, and sends `requiresLiveVerification: false`.
- Only `live`-classified answers require `verifiedLiveData: true`. The boolean is trusted without evidence, freshness or source checks.
- Browser-supplied instructions/context can be modified. The server must enforce its own trusted policy and access rules.
- Source-page links do not independently verify every sentence, and remote text is not checked against those pages.
- Static policies, numerical examples, blog claims and hours may be stale/inconsistent. Review them before treating them as verified; illustrative prices must never become live quotes.
- Non-Latin/Devanagari text is stripped. Hinglish variants, follow-ups and mixed intents are not reliably understood.
- General excerpts and unexpected-error replies may be English; complete Hinglish translation is not implemented.
- No server moderation, injection defense, response schema validation, message-length limit, abuse throttling, monitoring service or automated RAG evaluation suite is included.

### Maintain Knowledge

1. Update `businessProfile` and approved documents in `src/data/chatbotKnowledge.js`.
2. Keep stable `id`, `title`, `route`, `keywords`, `content` fields and valid source routes.
3. Update articles in `src/data/blogData.js`; the local index builds from them with the app.
4. Review hardcoded answers, expansions, allowed terms and preferred source IDs in `ragSearch.js`. Knowledge edits alone may not change intent-template answers.
5. Test greetings, business/unrelated/live questions and mixed intents in English/Romanized Hinglish.
6. Build/redeploy. CRM drafts do not update the index.

Messages are React state, not Firestore or local storage. Closing/reopening retains them while mounted; reloading clears them. Enabling an endpoint sends questions, recent history and context to it, so disclose/protect that data flow.

## CRM Portal

### Demo

After starting development, open `/admin/crm-demo`. It needs no staff login and skips CRM Firestore reads, showing sample requests, campaign progress, tasks, blog entries and application examples. Inventory/HR links remain protected. Exit Demo returns home.

### Protected Portal

`/admin/crm` requires an allowed role. Sync attempts one-time reads of `products`, `jobApplications` and `websiteRequests`, not real-time subscriptions.

| Control | Current behavior |
| --- | --- |
| Request search/status filter | Filters in-memory requests |
| Request status | React state only |
| Export | Downloads filtered `sgv-crm-requests.csv` |
| Add blog draft | In-memory title/category, no article body |
| Blog workflow | Local `Draft`, `Review`, `Ready`, `Live` labels |
| Action Queue | Static sample tasks |
| Campaigns/progress | Static sample records |
| Send Follow-up / Create Campaign | Buttons with no implemented actions |
| Inventory/HR links | Existing functional dashboards |
| Website Control Map | Navigation, not an editor |

**Current metrics are not verified business analytics.** Protected CRM starts with sample requests; denied/empty reads can leave them visible. An empty product list falls back to nine, empty applications can show sample candidates, and blog metrics count demo labels rather than published articles. Changes disappear on reload/remount; demo Sync resets requests.

Production CRM needs validated request intake, least-privilege rules, persisted edits, separated sample/live states, real CMS publishing and campaign delivery. This UI does not give complete control over the website.

## Content and Website Maintenance

### Publish a Blog

Articles are source records in `src/data/blogData.js`, not Firestore:

```text
id, slug, title, excerpt, category, author, date, readTime, tags,
image, metaTitle, metaDescription, content
```

1. Add/edit a unique ID and URL-safe slug, real ISO date, accurate metadata and valid public image.
2. Use Gold Guide, Silver Guide, Wedding, Investment or Care & Maintenance. `All` is a filter, not a post category.
3. Follow the existing content syntax. `BlogPost.jsx` supports headings, lists, tables, blockquotes and bold text through a limited custom renderer, not full Markdown/MDX.
4. Preview `/blog/YOUR_SLUG`, metadata and related links; update `public/sitemap.xml` manually.
5. Review retrieval because articles feed the bot, then build/deploy.

The first three records drive homepage featured posts. A CRM `Live` label does not publish/hide/edit a source article.

### Other Updates

| Change | Source / workflow |
| --- | --- |
| Add/delete uploaded products | `/admin`, ImgBB key and Firestore permissions |
| Edit an existing product | Controlled admin/Firestore tooling; no current edit form |
| Catalog fallback cards | `src/pages/Catalog.jsx` |
| Hero slides | `src/components/Hero.jsx` |
| Homepage collections/best sellers/testimonials | `src/components/HomeSections.jsx` |
| Business history/team | `src/pages/About.jsx` |
| Job openings | `jobOpenings` in `src/pages/Careers.jsx`; review application role options too |
| Review applications/notes/status | `/admin/hr` |
| Contact details/hours | Contact, Navbar/Footer, chatbot knowledge/templates and HTML/page schema |
| Branding/theme | `public/images/`, `public/sgv.svg`, Tailwind config, `src/index.css` |

Business facts are duplicated. Homepage schema currently says Monday-Saturday until 20:30; chatbot contact data says Monday-Sunday until 21:00. Confirm actual hours and synchronize sources before calling them authoritative.

## SEO, Analytics and Assets

- `index.html` is the entry with base metadata/canonical, organization/FAQ/local-business JSON-LD, Search Console verification, Maps and Analytics.
- Pages use `react-helmet-async` for titles, descriptions, Open Graph and selected schema; blog pages add Article JSON-LD.
- `ScrollToTop.jsx` tracks route path/search changes with the configured Analytics property. CRM does not read measured Analytics traffic/conversion data.
- `public/sitemap.xml` is manual and does not cover all blog/careers routes; it currently includes login. Maintain URLs/dates deliberately.
- `robots.txt` disallows `/admin/`, `/build/`, `/dist/`. Crawler hints are not access control and do not exclude all sensitive pages.
- `manifest.json` supplies app metadata, but no service worker/offline flow is registered.
- `index-ai-optimized.html` is reference HTML, not a configured build entry.
- The root Search Console verification HTML file is not in `public/` or explicitly copied by CI. Ensure deployment includes it if using file verification; the meta tag is separate.

Assets use root paths such as `/images/main/...` and `/images/optimized/...`. `OptimizedImage` adds lazy loading/async decoding, not resizing, compression or responsive variants. Installed Vite image plugins do not automatically transform public-folder assets.

Review canonical URLs, duplicate schema, map coordinates, testimonials and rating counts against approved data. Static ratings are not a live review feed. Domain changes need coordinated edits to URLs, schema, share links, sitemap/robots, Firebase domains, API CORS and hosting.

## Build and Deployment

### GitHub Pages

[deploy.yml](.github/workflows/deploy.yml) runs on pushes to `main`:

1. Checkout and set up Node 20.
2. `npm install --legacy-peer-deps`.
3. Build with configured Secrets mapped to Vite env variables.
4. Copy `dist/index.html` to `dist/404.html` for deep-link fallback.
5. Upload `dist/` and deploy with GitHub Pages Actions.

Enable Pages with the Actions source, configure custom domain/DNS, and supply build secrets from the env reference. The Pages environment is `github-pages`. Other branches, including `crm-portal`, do not deploy through this workflow until changes reach `main`; preview locally.

Root `CNAME` declares `sgvjewellers.in` but is not explicitly copied into `dist/`. Verify the custom domain in Pages settings rather than assuming the source file establishes it.

### Routing and Other Hosts

- Vite uses `base: '/'` for root/custom-domain hosting. Subpath hosting needs coordinated base, router and asset changes.
- `BrowserRouter` needs a host fallback for deep links like `/blog/SLUG` and `/admin/hr`.
- Pages' `404.html` fallback can visually render the SPA while returning HTTP 404; this is not equivalent to a proper server-side 200 rewrite for SEO.
- Plain `npm run build` does not create `404.html`; CI adds it separately.
- Other static hosts must serve `dist/` and configure SPA fallback/HTTP headers.
- Firebase rules deployment is separate from website deployment.
- Static hosting cannot execute an LLM handler; host that endpoint separately.

[codeql.yml](.github/workflows/codeql.yml) scans JavaScript/TypeScript and Actions on main pushes, main-targeting PRs and a weekly schedule. Pages CI builds but does not gate deployment on ESLint or a test suite.

## Verification

```bash
npm run lint
npm run build
npm run preview
```

At this documentation update, lint passed with **zero errors and one existing React Refresh warning** in `AuthContext.jsx`. Build passed with a JavaScript chunk-over-500-kB warning. These checks do not establish Firebase permissions, provider delivery, browser behavior or grounding correctness.

Manual checklist:

- Public routes, mobile navigation, images, links and unknown routes.
- Fallback/live catalog, filters and prefilled contact form.
- Allowed/denied staff, HR and admin operations with separate accounts.
- Applicant sign-in, documents, consent, save, HR review and profile visibility.
- Contact email and optional confirmation template delivery.
- CRM filters/export and non-persistence of demo changes.
- Bot business/greeting/care/policy answers, unrelated refusal and live handoff.
- Greeting-prefixed/mixed intents, Hinglish variants and unsupported Hindi text.
- Remote CORS, invalid JSON/non-2xx, missing answer, refusal flag, unverified live reply and hanging endpoint.
- Deployed deep links, DNS/HTTPS, auth domains and production env configuration.

Local chatbot smoke checks during this update covered contact, live-rate handoff, unrelated refusal, HUID and the eight-entry history payload. No remote model, live feed or external account was exercised. No committed unit, integration, browser or rules test suite exists.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Invalid Firebase API key / blank initial screen | Valid env, file location, server restart and AuthProvider initialization |
| Google sign-in blocked | Enabled provider, auth domain, popup policy and Firebase config |
| Dashboard opens but operations denied | Deployed rules and actual claims, not just frontend overrides |
| CRM shows sample data | Missing request rules, empty records or application-read permissions |
| CRM edits vanish / blog not published | Expected state-only prototype behavior |
| Contact email fails | Env mapping, template parameter names, provider restrictions |
| Saved application has no confirmation | Missing careers template/mapping or non-critical email failure |
| Files fail upload | Bucket, MIME, owner UID, Storage rules and strict under-5-MiB limit |
| Applicant has no visible records | Email query versus UID ownership rules; align query without weakening access |
| Profile fails for a user with a photo | `UserProfile.jsx` references `OptimizedImage` without importing it |
| Missing product-upload key | Add `VITE_IMGBB_API_KEY`; absent from `.env.example` |
| Video upload fails | No dedicated implementation |
| Bot never uses API | Unset URL, missing CI mapping or local refusal before POST |
| Live request gets handoff | Expected without verified live data; no bundled feed |
| Greeting plus rate question gets welcome | Greeting intent takes precedence |
| Bot stays thinking | No explicit endpoint timeout |
| Blank map | Script/API restrictions/quota or effect ran before `window.google` |
| Deep-link refresh fails | Host fallback, `404.html`, root/router assumptions |
| Node engine error | Match Vite's Node requirement |
| Large bundle warning | Current eager-loaded SPA; splitting is not implemented by this README |

## Security and Privacy

- Do not commit env files, service accounts, keys or private exports. Check staged changes even though common credential files are ignored.
- Browser config is public. Use provider restrictions and least-privilege rules, not key secrecy alone.
- Rules are important but not full schema/abuse protection; validate allowed fields/transitions and add rules tests.
- Careers collects sensitive personal and identity data. Establish appropriate notice, consent, retention, deletion and controlled handling before collecting real documents.
- Attachment download URLs are bearer-style links: do not assume SDK rules protect a shared URL. Review private delivery/token handling before operational use.
- HR notes are applicant-visible; separate private internal notes when needed.
- CSV/HTML `.xls` exports contain personal data. Review untrusted values for spreadsheet-formula/HTML injection before production export use.
- Client arithmetic CAPTCHA is not server-side bot protection. No App Check, malware scanning, throttling or orphan-file cleanup is integrated.
- Do not submit credentials, applicant files or private records to the chatbot; review endpoint data disclosure/handling.
- No configured HTTP security-header middleware, production error-monitoring service or consent-management platform is included.

[SECURITY.md](SECURITY.md) still contains template version/reporting sections. Establish a concrete private reporting channel and maintenance policy; never put secrets or personal documents in public issues.

## Remaining Production Work

These are **not completed features**:

- Persistent request intake, assignments, statuses, channel integrations, audit trail and verified CRM metrics.
- Real blog CMS/editor, preview/publication workflow and website settings.
- Campaign creation, approved audiences and delivered follow-ups.
- Trusted AI server with server-owned knowledge, validated responses, scope/moderation and abuse controls.
- Verified timestamped feeds for rates, stock, holiday hours, delivery and policy exceptions.
- Better intent handling, full Hinglish/multilingual support, cancellation/timeouts and source validation.
- Automated chatbot evaluations, frontend/rules tests and CI quality gates.
- Applicant query/rendering fixes, private document delivery, retention/deletion and export hardening.
- Storage/env/CI/domain/SEO configuration alignment.
- Bundle splitting, measured accessibility/performance and monitoring.

Embedding/vector search, payments, checkout and order/appointment systems would be additional implementation work, not configuration of an existing feature.

## Contributing and Related Documents

1. Read current code/README before relying on roadmaps.
2. Use the agreed branch, preserve unrelated changes and keep commits scoped. Use `crm-portal` for CRM work when assigned; deployment stays tied to `main`.
3. Never commit credentials, applicant files or sensitive exports.
4. Update docs when changing routes/schema/integrations; align `.env.example` and CI env mappings.
5. Run lint/build and exercise affected workflows with test data. Use a non-production Firebase project for risky changes.
6. Review before merging to `main`, which triggers deployment. This documentation change does not itself deploy the website or rules.

| Document | Purpose / caveat |
| --- | --- |
| [PRD.md](PRD.md) | Roadmap with inferred/older state and proposed features |
| [implementation.md](implementation.md) | SEO/AI-search playbook with examples/placeholders, not all implemented |
| [walkthrough.md](walkthrough.md) | Earlier UI/blog notes and historical verification |
| [task.md](task.md) | Earlier checklist, not a current feature inventory |
| [SECURITY.md](SECURITY.md) | Ownership/policy with unfinished template sections |

When documents differ, inspect source/deployed configuration. Do not present roadmap features as working capabilities.

## Ownership and License

The repository policy reserves rights to **Jas Shroff and Shree Gopaldas Vallabhdas Jewellers**. No separate open-source `LICENSE` file is included. Do not assume permission to reuse code, brand assets, content or photographs without owner approval. Dependencies retain their respective licenses.
