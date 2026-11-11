# SKILLX - Top-Tier Campus & Freelance Marketplace

SKILLX is a modern, responsive web application connecting talented student freelancers and vetted software engineers with campus clubs, collegiate startups, and local founders.

---

## 👥 Project Team & Contributors
- **Harshit Yadav** (`@harshitwsh`) - Core Architecture (`app.js`, `common.css`), Profile Step 1, Student Dashboard, Messaging & `user_profile.json`
- **Tamish Mehlawat** (`@mehlawattamish-art`) - Landing Page (`index.html`/`skillx.html`), Profile Step 2, Project Details & Local Server (`server.js`)
- **Aviraj** (`@sviraj-vsc`) - Find Work Marketplace, Profile Step 3, Application Proposal Form, `projects.json` & `applications.json`
- **Vansh Arora** (`@vansharoravka`) - Authentication (`login.html`), Why Us Pipeline, Applications Tracker, Settings Page & Project Documentation

---

## 🌐 Complete Pages & Modular Assets

Every page has its own dedicated CSS stylesheet (alongside `common.css`) and its own dedicated JavaScript file (alongside `app.js`):

1. **Landing & Hire Talent** (`index.html` / `skillx.html`, `index.css`, `index.js`)
   - Platform hero showcase, popular skill cards with project filtering, navbar search redirect, and smooth scrolling.
2. **Find Work & Gigs** (`find-work.html`, `find-work.css`, `find-work.js`)
   - Live project feed across 6 categories, budget listings, category filters, URL query filtering (`?q=` / `?category=`), and empty-state reset.
3. **Authentication & Campus Sign In** (`login.html`, `login.css`, `login.js`)
   - Tabbed Sign In / Create Account system, password visibility toggles, inline & toast validation, and demo student login.
4. **Step 1: Professional Info** (`profile-creation.html`, `profile-creation.css`, `profile-creation.js`)
   - Avatar upload & size check, live bio minimum character counter, experience tabs, multi-select skills, and local profile saving.
5. **Step 2: Portfolio & Links** (`profile-creation-step-2.html`, `profile-creation-step-2.css`, `profile-creation-step-2.js`)
   - Featured project validation, dynamic extra project rows, URL validation, and resume drag-and-drop uploader.
6. **Step 3: Availability & Preferences** (`profile-creation-step-3.html`, `profile-creation-step-3.css`, `profile-creation-step-3.js`)
   - Availability status cards, hourly rate range validation, contact channels, timezone sync, and automatic profile JSON export.
7. **Why Us & Vetting Pipeline** (`why-us.html`, `why-us.css`, `why-us.js`)
   - Interactive 4-stage vetting pipeline cards, animated candidate scorecard, navbar search, and comparison matrix.
8. **Student Dashboard** (`dashboard.html`, `dashboard.css`, `dashboard.js`)
   - Personalized greeting, sidebar navigation, live application stats, quick action shortcuts, and suggested project search filter.
9. **Project Details** (`project-details.html`, `project-details.css`, `project-details.js`)
   - Dynamic project loader via `?id=`, client verification badge, required skills, duplicate-proposal status check, and similar gigs.
10. **Application & Proposal Form** (`apply.html`, `apply.css`, `apply.js`)
    - Proposal form with live character count (0/2000), portfolio URL validator, drag-and-drop work sample uploader, agreement validation, and instant JSON download.
11. **Applications Tracking & JSON Manager** (`applications.html`, `applications.css`, `applications.js`)
    - Proposal tracking list with status badges, search & status filtering, withdraw option, per-item JSON download, bulk export, and JSON import.
12. **Direct Client Messaging** (`messages.html`, `messages.css`, `messages.js`)
    - Multi-thread client chat with persistent conversation storage, live conversation filtering, message validation, and simulated replies.
13. **Account & Profile Settings** (`settings.html`, `settings.css`, `settings.js`)
    - Synced student identity form, notification & privacy toggles, password validation, local JSON downloads, and demo data reset.

---

## 💾 Form Submission & Local JSON Data Storage

SKILLX implements client-side and filesystem JSON storage:
1. **Local Storage Persistence**: Submissions, profile steps, and messages persist in browser `localStorage` across all pages.
2. **Automatic & 1-Click JSON Download**:
   - Submitting an application on `apply.html` automatically exports and downloads `application_<id>.json`.
   - Completing profile setup on `profile-creation-step-3.html` exports `skillx_profile.json`.
   - On `applications.html`, users can click **Save JSON** on any individual proposal or **Export All (JSON)**.
3. **Structured Data Directory**:
   - `data/projects.json`: Database of campus projects across all 6 categories.
   - `data/applications.json`: Submitted application proposals.
   - `data/user_profile.json`: Verified student freelancer profiles.
4. **Optional Node.js Server (`server.js`)**:
   - Zero external dependencies. Uses Node built-in `http` and `fs`.
   - Run `node server.js` to serve on `http://localhost:3000` with direct JSON endpoints (`/api/save-application`, `/api/save-profile`).
   - Works out of the box even when opened statically without running the server!

---

## 🛠️ Tech Stack
- **HTML5**: Semantic markup and clean page links
- **CSS3**: Modular stylesheets per page (`common.css` + page CSS), Flexbox, CSS Grid, responsive layouts
- **Vanilla JavaScript (`app.js` + per-page `.js` files)**: Form validation, character counting, dynamic filtering, drag-and-drop uploads, `localStorage` state, and Blob JSON downloading
