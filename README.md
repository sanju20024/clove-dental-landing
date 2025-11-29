# Create README.md file for user
content = r"""# Clove Dental — Landing Page

**Clove Dental — Landing Page** is a beginner-friendly, responsive landing page built from a Figma reference.  
It demonstrates a modern, service‑based website layout implemented using **plain HTML, CSS and vanilla JavaScript** (no frameworks).

---

## Table of contents
1. [Project overview](#project-overview)  
2. [Features](#features)  
3. [Project structure](#project-structure)  
4. [Screenshots](#screenshots)  
5. [Technologies used](#technologies-used)  
6. [Core components explained](#core-components-explained)  
7. [How to run (local)](#how-to-run-local)  
8. [Deploying (GitHub Pages & Vercel)](#deploying-github-pages--vercel)  
9. [Recommended `.gitignore`](#recommended-gitignore)  
10. [Accessibility & performance notes](#accessibility--performance-notes)  
11. [Known issues & troubleshooting](#known-issues--troubleshooting)  
12. [Future improvements](#future-improvements)  
13. [License & credits](#license--credits)  
14. [Contact](#contact)

---

## Project overview
This repository contains a static landing page for a dental clinic called **Clove Dental**. The layout contains the usual sections you expect from a modern service website and demonstrates:
- Responsive layout and breakpoints for mobile/tablet/desktop.
- Interactive JavaScript features (carousel, modals, accordions, animated counters, scrollers).
- Simple client-side form validation and demo submission flow (uses `localStorage` for demo).
- Dark/light theme support with user preference persistence.

> **Note:** This is a static demo. The form submissions are mocked on the client side and do not send data to a backend.

---

## Features
- Fully responsive layout (mobile-first decisions where appropriate).
- Accessible navigation:
  - Sticky header, keyboard support, ESC to close, click-outside to close.
- Hero carousel:
  - Infinite loop with cloned slides, touch/swipe and keyboard navigation, lazy-loaded images.
- Booking form:
  - Inline validation, clear error messaging, mock submit to `localStorage`.
- Services:
  - Clickable cards that open an accessible modal with dynamic content.
- Testimonials:
  - YouTube-based testimonials with hover previews, modal playback and sound toggle.
- Features strip & logos:
  - Continuous auto-scrolling ribbon with hover slowdown + partner logo scroller.
- FAQ:
  - Searchable accordion, deep-link support, keyboard navigation.
- Dark/light theme toggle persisted to `localStorage`.
- Micro-interactions and subtle animations (reveal, hover lifts, counters).

---

## 📁 Project Folder Structure

```
clove_landing/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── hero-1.webp
│   ├── hero-2.webp
│   ├── hero-3.webp
│   ├── hero-4.webp
│   ├── hero-5.webp
│   ├── logo.svg
│   ├── root-canal-card.png
│   ├── root-dentistry-card.png
│   ├── root-import-card.png
│   ├── root-or-card.png
│   ├── trust-1.png
│   ├── trust-2.png
│   ├── trust-3.png
│   ├── trust-4.png
│   ├── trust-5.png
│   └── why-choose-us.webp
└── README.md
```


## Screenshots
(Images are stored in `/images/` - use them in this README or on the repo page)
- `images/Screenshot 2025-11-30 004011.png` — Light mode overview  
- `images/Screenshot 2025-11-30 004022.png` — Booking form (light mode)  
- `images/Screenshot 2025-11-30 004046.png` — Dark mode view  
- `images/Screenshot 2025-11-30 004056.png` — Footer (dark mode)

---

## Technologies used
- HTML5 (semantic markup)
- CSS3 (custom properties, responsive layout, transitions/animations)
- JavaScript (ES6+) — DOM, events, IntersectionObserver, touch events
- Browser APIs: `IntersectionObserver`, `localStorage`, `requestAnimationFrame`

---

## Core components explained
**Header & Navigation**
- Sticky header with logo and phone CTA. Submenus implemented with ARIA attributes and keyboard support.

**Hero Carousel**
- Built with cloned slides (leading/trailing) for seamless infinite looping.
- Controls: autoplay, pause on hover/focus, arrow keys, touch swipe.

**Booking Form**
- Uses robust selectors and graceful fallback to find fields.
- Validates `name`, `phone`, `service`, `date`. Shows inline errors and saves sample data into `localStorage` on submit (for demo only).

**Services**
- Click or keyboard activation opens modal populated from a JS `DETAILS` map. Modal manages focus and is dismissible via ESC/backdrop.

**Video Testimonials**
- Lightweight approach: thumbnails are generated from YouTube IDs and embeds are injected when the modal opens to avoid loading many iframes.
- Short-card hover previews inject muted autoplay iframe when appropriate.

**Features / Trust**
- Continuous scrollers are implemented by duplicating child nodes until the track is wide enough, then translating with `requestAnimationFrame`.

**FAQ**
- Live search, keyboard navigation, deep-linking via hash (`#faq-2`) so users can link specific answers.

---

## How to run (local)
Open the project in your browser — no build tools required.

1. Clone the repo:
```bash
git clone https://github.com/sanju20024/clove-dental-landing.git
cd clove-dental-landing
# Python 3
python -m http.server 5173
# then open http://localhost:5173 in your browser
https://sanju20024.github.io/clove-dental-landing/
