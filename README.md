# SKILLX - Top-Tier Campus & Freelance Marketplace

SKILLX is a modern, responsive web application connecting talented student freelancers and vetted software engineers with campus clubs, collegiate startups, and local founders.

---

## 👥 Project Team & Contributors
- **Harshit Yadav** (`@harshitwsh`) - Core Architecture, Design Tokens, Landing UI & Step 3 Availability
- **Tamish Mehlawat** (`@mehlawattamish-art`) - Marketplace Browse, Step 1 Professional Profile & Vetting Pipeline
- **Aviraj** (`@sviraj-vsc`) - Authentication Flow, Step 2 Portfolio/Resume & Comparison Matrix
- **Vansh Arora** (`@vansharoravka`) - Job Listings Cards, Responsive CSS Polish & Project Documentation

---

## 🌐 Complete Pages & Features

Every page has its own dedicated, clean CSS stylesheet alongside `common.css`:

1. **Landing & Hire Talent** (`index.html` / `skillx.html`, `index.css`)
   - Platform hero showcase, popular skill cards, and 3-step timeline.
2. **Find Work & Gigs** (`find-work.html`, `find-work.css`)
   - Live project feed, budget listings, category filters, and real-time search.
3. **Authentication & Campus Sign In** (`login.html`, `login.css`)
   - Tabbed Sign In / Create Account system with verified student badge, validation, and demo accounts.
4. **Step 1: Professional Info** (`profile-creation.html`, `profile-creation.css`)
   - Avatar upload, headline, experience levels, and technical skill categories.
5. **Step 2: Portfolio & Links** (`profile-creation-step-2.html`, `profile-creation-step-2.css`)
   - Featured projects, social URLs, and resume upload dropzone.
6. **Step 3: Availability & Preferences** (`profile-creation-step-3.html`, `profile-creation-step-3.css`)
   - Availability status cards, hourly rate range, timezone sync, and automatic profile JSON export.
7. **Why Us & Vetting Pipeline** (`why-us.html`, `why-us.css`)
   - 4-Stage Vetting Funnel, candidate scorecard, and head-to-head comparison matrix.
8. **Student Dashboard** (`dashboard.html`, `dashboard.css`)
   - Student dashboard with sidebar navigation, active/completed stats, quick action shortcuts, and curated suggested projects.
9. **Project Details** (`project-details.html`, `project-details.css`)
   - Full project brief, client verification badge, required skills, application deadline, project summary card, and similar project recommendations.
10. **Application & Proposal Form** (`apply.html`, `apply.css`)
    - Client proposal form with live character count (0/2000), portfolio URL validator, drag-and-drop work sample uploader, delivery estimates, budget agreements, and instant JSON download upon submission.
11. **Applications Tracking & JSON Manager** (`applications.html`, `applications.css`)
    - Proposal tracking list with review status badges ("Under Review", "Shortlisted", "Accepted"), per-item JSON download, bulk JSON export (`applications.json`), and JSON file import.
12. **Direct Client Messaging** (`messages.html`, `messages.css`)
    - Interactive direct chat between campus freelancers and verified client organizers (e.g. Robotics Club, Tech Summit Lead).

---

## 💾 Form Submission & Local JSON Data Storage

SKILLX implements client-side and filesystem JSON storage:
1. **Local Storage Persistence**: Submissions immediately persist in browser `localStorage` across all pages.
2. **Automatic & 1-Click JSON Download**:
   - Submitting an application on `apply.html` automatically exports and downloads `application_<id>.json`.
   - On `applications.html`, users can click **Save JSON** on any individual proposal or **Export All (JSON)**.
3. **Structured Data Directory**:
   - `data/projects.json`: Database of campus projects.
   - `data/applications.json`: Submitted application proposals.
   - `data/user_profile.json`: Verified student freelancer profiles.
4. **Optional Node.js Server (`server.js`)**:
   - Zero external dependencies. Uses Node built-in `http` and `fs`.
   - Run `node server.js` to serve on `http://localhost:3000` with direct file-writing endpoints (`/api/save-application`).
   - If running as a static site (e.g. standard file opening or Live Server), client-side saving & JSON downloading works seamlessly out of the box!

---

## 🛠️ Tech Stack
- **HTML5**: Semantic tags, accessibility (a11y), clean structure
- **CSS3**: CSS Variables (custom design system), Flexbox, CSS Grid, mobile responsive queries
- **Vanilla JavaScript (`app.js`)**: Form validation, character counting, dynamic filtering, file upload drag-and-drop, and Blob JSON downloading
