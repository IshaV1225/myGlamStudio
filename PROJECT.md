# PROJECT.md — Glam Studio

> A personal makeup studio web app where users can document, organize, and showcase their makeup looks, products, brands, inspo, and mood boards.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Authentication & User Model](#4-authentication--user-model)
5. [Onboarding — Profile Setup Quiz](#5-onboarding--profile-setup-quiz)
6. [Database Schema](#6-database-schema)
7. [App Structure & Routes](#7-app-structure--routes)
8. [Pages — Detailed Spec](#8-pages--detailed-spec)
   - [8.1 Home Page](#81-home-page)
   - [8.2 My Looks](#82-my-looks)
   - [8.3 My Brands + Products](#83-my-brands--products)
   - [8.4 My Inspo](#84-my-inspo-to-be-done)
   - [8.5 Mood Board](#85-mood-board)
   - [8.6 Settings](#86-settings)
   - [8.7 Beauty Portfolio](#87-beauty-portfolio)
9. [Shared UI Components](#9-shared-ui-components)
10. [Feature Flags & Future Work](#10-feature-flags--future-work)

---

## 1. Project Overview

**App Name:** `{Username}'s Glam Studio`
**Type:** Multi-user, fully responsive web application
**Purpose:** A personal makeup studio platform that lets each user:
- Record and reference makeup looks they have created (images, steps, products)
- Track their favourite products and preferred brands
- Build and organize mood boards
- Save inspo images from Pinterest or their own gallery
- Present a public-facing Beauty Portfolio

**Primary Users:** Beauty enthusiasts who want a structured, personal space to document their makeup journey.

**Responsiveness:** Fully responsive — optimized equally for mobile and desktop.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| UI Library | React 18+ |
| Styling | Tailwind CSS |
| Database & Auth | Firebase (Firestore + Firebase Auth) **or** Supabase (PostgreSQL + Supabase Auth) — *choose one at project start* |
| File Storage | Firebase Storage **or** Supabase Storage (for images uploaded by users) |
| State Management | React Context + `useState` / `useReducer` (or Zustand if complexity grows) |
| AI Feature | AI-powered image description on Mood Boards — *provider TBD (OpenAI / Anthropic / other)* |
| External APIs | Pinterest API *(To Be Done)*, Google Trends API *(To Be Done)*, Makeup Brand API (for brand/product lookup during onboarding) |
| Font | `Arcadian` from Canva — embed as a custom font via `@font-face` in global CSS |
| Deployment | Vercel (recommended for Next.js) |

---

## 3. Design System

### Color Palette — "Ocean Sunset"
Inspired by indigos, deep plum, and coral pinks. Define as CSS variables and Tailwind config tokens.

```css
--color-primary:      #4B3B8C;   /* Deep Indigo */
--color-secondary:    #7B3F6E;   /* Deep Plum */
--color-accent:       #F4796B;   /* Coral Pink */
--color-accent-light: #F9B4A8;   /* Soft Coral */
--color-bg:           #0F0A1E;   /* Near-black indigo bg */
--color-surface:      #1C1333;   /* Card/surface bg */
--color-text:         #F5EEF8;   /* Off-white text */
--color-muted:        #9B8DB0;   /* Muted label text */
```

> Adjust exact hex values to match the palette from colors.co during visual design phase.

### Typography
- **Primary font:** `Arcadian` (Canva) — used throughout the entire website
- **Fallback:** `Georgia`, serif

### Buttons
- Shape: Rectangular with rounded edges (`border-radius: 8px` or `rounded-lg` in Tailwind)
- Used consistently across all CTAs, modals, and forms

### Reference Websites (for design inspiration)
- https://fentybeauty.com/en-ae
- https://www.makeupbymario.com/en-ae/collections/eyes

---

## 4. Authentication & User Model

- **Multi-user** — each user has their own account and isolated data
- Auth methods: Email + Password (required), optional social login (Google) if desired
- On first login → redirect to **Onboarding Quiz** (see Section 5)
- On subsequent logins → redirect to **Home Page**
- Auth state managed via Firebase Auth or Supabase Auth session

### User Profile Fields (stored in DB)

```ts
interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  age?: number;
  skinType: string;           // e.g. "Oily", "Dry", "Combination", "Normal", "Sensitive"
  skinTone: string;           // e.g. "Fair", "Light", "Medium", "Tan", "Deep"
  complexion: string;         // e.g. "Cool", "Warm", "Neutral"
  location: string;           // e.g. "UAE", "US", "IND", "CA", "CN"
  preferredBrands: string[];  // Array of brand names
  preferredLooks: string[];   // e.g. ["Full Glam", "Office Going", "Natural"]
  heroImageUrl?: string;      // Main hero image URL
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

---

## 5. Onboarding — Profile Setup Quiz

Shown **once** on first login. A multi-step form (wizard/stepper UI).

### Steps & Fields

| Step | Field | Input Type | Notes |
|---|---|---|---|
| 1 | Name | Text input | Becomes the studio title |
| 2 | Age | Number input | Optional |
| 3 | Skin Type | Single select | Oily / Dry / Combination / Normal / Sensitive |
| 4 | Skin Tone | Single select | Fair / Light / Medium / Tan / Deep |
| 5 | Complexion | Single select | Cool / Warm / Neutral |
| 6 | Preferred Looks | Multi-select | Full Glam, Office Going, Natural, Bridal, Editorial, etc. |
| 7 | Preferred Brands | Multi-select + search | Pull brand list from makeup brand API |
| 8 | Location | Dropdown | UAE, US, IND, CA, CN, UK, etc. |
| 9 | Hero Image | File upload OR pick from default gallery | Optional — can skip and set later |

- Progress bar shown at top of each step
- "Back" and "Next" buttons on each step
- "Finish & Enter My Studio" CTA on final step
- All fields (except Name) are optional — user can complete via Beauty Portfolio later

---

## 6. Database Schema

> Use Firestore collections or Supabase tables as appropriate for your chosen DB.

### Collections / Tables

#### `users`
Matches `UserProfile` interface above.

#### `looks`
```ts
interface Look {
  id: string;
  userId: string;
  name: string;
  imageUrls: string[];        // Array of image URLs (carousel)
  steps: string[];            // Ordered bullet points of technique/steps
  productsUsed: string[];     // Product IDs referencing `products` collection
  moodBoardIds: string[];     // Mood board IDs referencing `moodBoards` collection
  isTopFive: boolean;         // Whether this look is in the user's Top 5
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### `products`
```ts
interface Product {
  id: string;
  userId: string;
  name: string;
  brand: string;
  imageUrls: string[];
  isFavourite: boolean;       // Heart = favourite (max 20 favourites per user)
  createdAt: timestamp;
}
```

#### `brands`
```ts
interface Brand {
  id: string;
  userId: string;
  name: string;
  websiteUrl?: string;
  logoUrl?: string;
}
```

#### `moodBoards`
```ts
interface MoodBoard {
  id: string;
  userId: string;
  name: string;               // e.g. "Espresso", "Icy", "Smoky", "Clean Girl"
  imageUrls: string[];
  sourceType: "upload" | "pinterest";
  pinterestBoardUrl?: string;
  aiDescription?: string;     // AI-generated description (provider TBD)
  createdAt: timestamp;
}
```

#### `inspoFolders` *(To Be Done)*
```ts
interface InspoFolder {
  id: string;
  userId: string;
  name: string;               // e.g. "Strawberry Matcha", "Espresso"
  imageUrls: string[];
  sourceType: "upload" | "pinterest";
}
```

---

## 7. App Structure & Routes

```
/                          → Redirect to /home if logged in, else /login
/login                     → Login page
/register                  → Register page
/onboarding                → Profile setup quiz (shown once after first register)
/home                      → Main Home Page
/looks                     → My Looks (masonry gallery)
/looks/[lookId]            → Individual Look Gallery Page
/products                  → My Brands + Products
/inspo                     → My Inspo (placeholder / To Be Done)
/moodboard                 → Mood Board gallery
/settings                  → Settings page
/portfolio                 → Beauty Portfolio page
```

### Layout
- A **persistent Nav Bar** is shown on every page (except `/login`, `/register`, `/onboarding`)
- Nav Bar contains:
  - Left: Studio title `{Name}'s Glam Studio` (clickable → `/home`)
  - Center: Nav links — Home · My Looks · My Products · My Inspo · Mood Board
  - Right: Settings icon (⚙️) + Beauty Portfolio icon (📓)

---

## 8. Pages — Detailed Spec

---

### 8.1 Home Page

**Route:** `/home`

#### Layout (top to bottom)
1. **Hero Image / Video** — Full-width banner. User's chosen hero image or default. Overlaid with studio title `{Name}'s Glam Studio`.
2. **Top 5 Looks** section
   - Horizontal scroll row of 5 look cards
   - Each card: on hover → cycles through that look's image gallery (image slideshow)
   - Below each card: "View Details" button → navigates to `/looks/[lookId]`
3. **Top Products** section
   - Heading: `Top {count} Products`
   - Horizontal scroll row showing favourite products (up to 20)
   - Each product card: product image + name
   - Heart icon (♥) to toggle favourite status

---

### 8.2 My Looks

**Route:** `/looks`

#### Main Gallery Page
- **Layout:** Masonry grid (Pinterest-style variable height cards)
- Each card: look image(s), look name
- Hover effect: subtle scale or overlay with "View Look" CTA
- **Top of page:** Filter/highlight Top 5 looks (marked with ♥ or ★)
- **Action buttons:**
  - `+ Add Look` → opens Add Look modal
  - `Edit Top 5` → toggle heart (♥) on looks; enforces max 5

#### Add Look Modal
Fields:
- Look Name (text)
- Upload Images (multi-image upload)
- Make Top 5? (toggle — disabled if already 5 selected)
- Products Used (multi-select from user's saved products)
- Steps / Techniques (dynamic text fields — add/remove bullet points)
- Mood Board (select from user's saved mood boards)

#### Individual Look Page — `/looks/[lookId]`
**Layout (two-column on desktop, stacked on mobile):**
- **Left column:** Image carousel slider with all look images
- **Right column:**
  - Look name as heading
  - `Steps & Techniques` section — ordered bullet list
  - `Products Used` section — list of product names/cards
  - `Mood Boards` section — linked mood board names (click → `/moodboard`)
- **Top:** Back to Gallery button
- **Options:** Edit Look button (opens edit modal), Remove Look button (confirmation popup)

---

### 8.3 My Brands + Products

**Route:** `/products`

#### Layout
- **Section 1 — Top Products**
  - Heading: `Top {count} Products` (count = number of hearted items, max 20)
  - Grid of product cards with heart (♥) toggle
  - `+ Add Product` button → modal
  - `Load More` button at bottom for all products beyond initial view
- **Section 2 — Top Brands**
  - Heading: `Top Brands`
  - Grid of brand logo/name boxes
  - Pre-populated from onboarding quiz selections
  - Click brand → opens brand's website in new tab
  - `+ Add Brand` button → searchable dropdown from brand list (API-powered)
  - Remove brand option (X on each brand box)

#### Add Product Modal
Fields:
- Product Name
- Brand (text or select)
- Upload Images (multi-image)
- Add to Favourites? (heart toggle — enforces max 20)

#### Product Detail Popup
- Product images (carousel or grid)
- Product name + brand
- Edit / Remove buttons

---

### 8.4 My Inspo *(To Be Done)*

**Route:** `/inspo`

> ⚠️ This page is planned but **not built in v1**. Render a placeholder UI with "Coming Soon" messaging and the planned feature list below.

#### Planned Features (for future implementation)
- **Trend Scroll Bar** — Latest makeup trends (clean girl, bridal, bold, Indian bride, etc.) pulled via Google Trends API filtered by user's location
- **Pinterest Integration** — Connect Pinterest account, import boards/pins via Pinterest API
- **Inspo Folders** — User-created folders of similar looks with custom names (e.g. "Espresso", "Icy", "Smoky", "Clean Girl", "Strawberry Matcha")
- **Click to View** — Click any inspo image to view full-size popup
- **Top Trends** — Location-based trending makeup hashtags

---

### 8.5 Mood Board

**Route:** `/moodboard`

#### Main Mood Board Gallery
- Grid of mood board cards — each shows: cover image + mood board name
- Click card → view that mood board's full image collection in a popup or expanded view
- **Action buttons:**
  - `+ Upload Mood Board` → modal (upload images or connect Pinterest)
  - `Remove Mood Board` → popup to select which board to delete

#### Mood Board View (popup or expanded)
- Full image grid of all images in that mood board
- **AI Description** — AI-generated text description of the mood board's aesthetic (provider TBD — OpenAI / Anthropic)
- Back button

#### Add Mood Board Modal
Fields:
- Mood Board Name (e.g. "Espresso", "Icy", "Tropical")
- Source: Upload from device OR Import from Pinterest *(Pinterest = To Be Done)*
- Upload Images (multi-image)

---

### 8.6 Settings

**Route:** `/settings`

All editable fields shown as form sections with inline Edit buttons that open popups/modals.

| Setting | Action |
|---|---|
| Name | Change name → popup with text input |
| Email | Add / Change email → popup |
| Password | Change / Add password → popup (with current password confirmation) |
| Location | Change location → dropdown (UAE, US, IND, CA, CN, UK, etc.) |
| Skin Type | Change skin type → single-select |

---

### 8.7 Beauty Portfolio

**Route:** `/portfolio`

A personal profile-style page. Each section has its own Edit popup.

| Section | Edit Action |
|---|---|
| Hero Picture | Upload new image or pick from default gallery |
| Skin Type | Update skin type (single-select) |
| Complexion | Update complexion (Cool / Warm / Neutral) |
| Preferred Brands | Add / remove brands (multi-select) |
| Preferred Looks | Add / remove look styles (multi-select) |
| Products | Link to My Products page |

---

## 9. Shared UI Components

These components are reused across multiple pages. Build them as standalone React components.

| Component | Description |
|---|---|
| `<NavBar />` | Persistent top nav with title, links, settings + portfolio icons |
| `<Modal />` | Reusable popup/modal with overlay, close button, and slot for content |
| `<ImageCarousel />` | Swipeable/clickable image slider for looks and products |
| `<MasonryGrid />` | CSS/JS masonry layout for My Looks page |
| `<ProductCard />` | Product image + name + heart toggle |
| `<LookCard />` | Look thumbnail with hover image cycle effect |
| `<BrandBox />` | Brand name/logo box, clickable to external website |
| `<MoodBoardCard />` | Mood board cover + name card |
| `<HeroImage />` | Full-width hero banner with overlay text |
| `<StepList />` | Dynamic add/remove bullet-point list (used in Look forms) |
| `<ConfirmPopup />` | Generic "Are you sure?" confirmation dialog |
| `<OnboardingWizard />` | Multi-step stepper form used during onboarding |
| `<LoadMoreButton />` | Pagination trigger for product/look lists |

---

## 10. Feature Flags & Future Work

| Feature | Status | Notes |
|---|---|---|
| My Inspo Page — Google Trends | 🔜 To Be Done | Requires Google Trends API integration |
| My Inspo Page — Pinterest Import | 🔜 To Be Done | Requires Pinterest OAuth + API |
| Mood Board — Pinterest Import | 🔜 To Be Done | Shared with Inspo Pinterest integration |
| AI Mood Board Description | 🔜 Provider TBD | OpenAI / Anthropic — plug in API key when decided |
| Makeup Brand API | 🔜 To Be Done | Used during onboarding for brand search — find suitable API (e.g. Open Beauty Facts) |
| Public Portfolio View | 💡 Future Idea | Allow users to share a public link to their Glam Studio |
| Social / Follow Feature | 💡 Future Idea | Follow other users' studios |

---

*Last updated: April 2026*
*Built with Next.js · React · TypeScript · Tailwind CSS · Firebase/Supabase*
