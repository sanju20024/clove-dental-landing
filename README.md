# Clove Dental — Landing Page
This project is a beginner-friendly, responsive landing page built from a Figma reference.
It implements **6 sections** (HEADER / NAV, HERO, FEATURES STRIP, BOOKING FORM, SERVICES / TREATMENTS, FEATURES STRIP, SERVICES, Testimonials, WHY CHOOSE, STATS / TRUST STRIP, FAQ + FOOTER)
using only **HTML, CSS, and Vanilla JavaScript**.

## Project tree
```
clove_landing/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── hero-1.webp
|   ├── hero-2.webp
│   ├── hero-3.webp
|   ├── hero-4.webp
│   ├── hero-5.webp
|   ├── logo.svg
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

# 📖 Table of Contents
1. Project Overview  
2. Features  
3. Screenshots  
4. Folder Structure  
5. Technologies Used  
6. Core Components Explained  
7. JavaScript Functionality  
8. Responsive Design  
9. Accessibility Features  
10. Performance Optimizations  
11. How to Run  
12. Known Issues and Fixes  
13. Future Improvements  
14. License  

---

# 📌 1. Project Overview
This project is a **clinically themed landing page** designed for Clove Dental.  
It contains all essential sections expected from a modern service-based business landing page:

- Hero carousel  
- Booking form  
- Services section with modals  
- Patient video testimonials  
- Trust + stats strip  
- FAQ accordion with search  
- Footer with CTA  
- Dark mode support  

The goal is to provide an industry-level demonstration of UI/UX and JavaScript behavior without using frameworks like React or Bootstrap.

---

# ✨ 2. Features

### ✅ Fully Responsive UI  
Optimized for:
- Mobile (Android, iOS)  
- Tablet  
- Laptop / Desktop  

### 🌙 Dark / Light Mode  
- Toggle stored in **localStorage**  
- Applies theme instantly on load  

### 🧭 Advanced Navigation  
- Mobile hamburger menu  
- Nested submenus  
- Click-outside to close  
- ESC key support  

### 🎠 Hero Carousel  
- Autoplay (infinite loop)  
- Touch swipe control  
- Keyboard arrows  
- lazy-loaded images  

### 🧾 Booking Form  
- Inline field validation  
- Required fields: name, phone, service, date  
- Real-time error messages  
- Mock backend submission using localStorage  

### 🦷 Services / Treatments  
- Clickable service cards  
- Dynamic modal content injected through JS  
- Backdrop close + ESC close  

### 🎬 Video Testimonials  
- YouTube embed (privacy optimized)  
- Hover autoplay previews  
- Shorts-style horizontal scrolling carousel  
- Modal with sound toggle  

### ⭐ Why Choose Us  
- Scroll reveal animations  
- Icon micro-interactions  
- Mini counters with motion easing  

### 📊 Stats + Trust Logos  
- Animated counters using IntersectionObserver  
- Auto-scrolling partner logo strip  

### ❓ FAQ Section  
- Accordion interactions  
- Search filter  
- Deep linking support (#faq-2 auto-opens)  
- Keyboard navigation  

### ⬆ Back To Top  
- Smooth scroll  
- Auto-visibility based on page height 

# 🖼 3. Screenshots
![Light Mode Image](images/Screenshot%202025-11-30%20004011.png)
![BOoking Form In Light Mode](images/Screenshot%202025-11-30%20004022.png)
![Dark Mode Page Appearence](images/Screenshot%202025-11-30%20004046.png)
![Footer IN Drak MOde](images/Screenshot%202025-11-30%20004056.png)


---

# 🛠 5. Technologies Used

### Front-end  
- **HTML5** – semantic markup  
- **CSS3** – responsive styling, variables, animations  
- **JavaScript (ES6)** – interactions, modals, forms, observers  

### Browser APIs  
- IntersectionObserver  
- LocalStorage  
- requestAnimationFrame  
- DOM Events  
- Touch Events  

---

# 🧱 6. Core Components Explained

### Header & Navigation  
- Sticky header  
- Auto position submenu  
- Hamburger menu animation  

### Hero Section  
- Infinite loop carousel with cloned slides  
- Handles image load failures  

### Features Strip  
- Continuous horizontal auto-scroll  
- Cloned items for seamless loop  

### Booking Form  
- Validates fields before submission  
- Displays inline errors  
- Saves to localStorage for demo  

### Services + Modal  
- Data-driven modal content  
- Accessibility: aria-hidden, focus control  

### Video Testimonials  
- YouTube embeds with autoplay + mute toggle  
- Custom modal with backdrop  

### Why Choose Us  
- Reveal animations  
- Mini counters  

### Stats & Trust Logos  
- Easing-based animated numbers  
- Auto-scrolling trust bar  

### FAQ  
- Search filter  
- Close/open all logic  
- Keyboard and hash support  

---

# 📱 7. Responsive Design Notes
Breakpoints used:

-----------------------------------------Website Link-----------------------------------------------
                                               ()