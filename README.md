# SKILLX - Top-Tier Campus & Freelance Marketplace

SKILLX is a modern, responsive web application connecting talented student freelancers and vetted software engineers with campus clubs, collegiate startups, and local founders.

---

## 🏆 3rd Evaluation Deliverables & Parameters Overview

| Parameter | Feature Implemented | Endpoints & Key Files |
| :--- | :--- | :--- |
| **1. External APIs Calls** | Live Currency Exchange Rate API (`open.er-api.com`), GitHub Developer Profile Verifier (`api.github.com`), Motivational Quotes API | `GET /api/external/currency`<br>`GET /api/external/github/:username`<br>`GET /api/external/quote`<br>Integrated in `find-work.html` & `api-explorer.html` |
| **2. Node & Express Setup** | Express 5.3 backend server with CORS, JSON body parser, URLencoded parser, request logging, and static asset delivery | `server.js`, `package.json`, `.env`<br>Runs on `http://localhost:3000` |
| **3. Express APIs for Local JSON Files** | Express endpoints that save and fetch real-time application data directly into `data/*.json` | `GET /api/json/projects`<br>`POST /api/json/projects`<br>`GET /api/json/applications`<br>`POST /api/json/applications`<br>`DELETE /api/json/applications/:id`<br>`GET /api/json/profile`<br>`POST /api/json/profile` |
| **4. MongoDB Atlas CRUD Operations** | Full Mongoose models & Create, Read, Update, Delete REST operations connected to MongoDB Atlas | `POST /api/db/projects` (Create)<br>`GET /api/db/projects` (Read all)<br>`GET /api/db/projects/:id` (Read one)<br>`PUT /api/db/projects/:id` (Update)<br>`DELETE /api/db/projects/:id` (Delete)<br>`POST /api/db/applications` (Create)<br>`GET /api/db/applications` (Read all)<br>`PATCH /api/db/applications/:id/status` (Update status)<br>`DELETE /api/db/applications/:id` (Delete/Withdraw) |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```
*(Dependencies: `express`, `mongoose`, `cors`, `dotenv`)*

### 2. Configure Environment (`.env`)
The database connection string is pre-configured in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://teamsftgym_db_user:giAPYPupc04qfZUw@cluster0.nktdewv.mongodb.net/backend_db?retryWrites=true&w=majority
```

### 3. Start the Express Server
```bash
npm start
# or: node server.js
```
The server will output:
```
[MongoDB Atlas] Connected successfully to: backend_db
🚀 SKILLX Production Express Server running on:
👉 Local:     http://localhost:3000
👉 API Docs:  http://localhost:3000/api-explorer.html
👉 Status:    http://localhost:3000/api/health
```

### 4. Open the Interactive Evaluation Suite
Open your browser and navigate to:
**`http://localhost:3000/api-explorer.html`**

In this interactive suite, the evaluator can:
- View live MongoDB Atlas connection status (green pulsing indicator).
- Test **External APIs** (Live currency conversion from INR to USD/EUR/GBP & GitHub user lookup).
- Test **Local JSON APIs** (Read/Write to `data/projects.json` and `data/applications.json`).
- Execute all **MongoDB CRUD Operations** (Create project, Read projects/applications, Update status, Delete documents) with live feedback and auto-refresh!

---

## 📡 API Reference & Testing Commands

### Parameter 1: External APIs
- **Currency Exchange Rate**:
  ```bash
  curl http://localhost:3000/api/external/currency
  ```
- **GitHub Profile Verification**:
  ```bash
  curl http://localhost:3000/api/external/github/harshitwsh
  ```
- **Tech Motivation Quote**:
  ```bash
  curl http://localhost:3000/api/external/quote
  ```

### Parameter 2: Server Health & Node Setup
- **Health Check**:
  ```bash
  curl http://localhost:3000/api/health
  ```

### Parameter 3: Express Local JSON APIs
- **Get Projects from JSON**:
  ```bash
  curl http://localhost:3000/api/json/projects
  ```
- **Get Applications from JSON**:
  ```bash
  curl http://localhost:3000/api/json/applications
  ```
- **Post Application to JSON**:
  ```bash
  curl -X POST http://localhost:3000/api/json/applications \
    -H "Content-Type: application/json" \
    -d '{"projectTitle":"React Campus App","clientName":"Tech Club","budget":"₹2500"}'
  ```

### Parameter 4: MongoDB Atlas CRUD APIs
- **Create Project (CREATE)**:
  ```bash
  curl -X POST http://localhost:3000/api/db/projects \
    -H "Content-Type: application/json" \
    -d '{"title":"AI Bot for Library","category":"AI & ML","budget":3000,"skills":["Python","FastAPI"]}'
  ```
- **Read All Projects (READ)**:
  ```bash
  curl http://localhost:3000/api/db/projects
  ```
- **Read One Project (READ)**:
  ```bash
  curl http://localhost:3000/api/db/projects/proj-1
  ```
- **Update Project (UPDATE)**:
  ```bash
  curl -X PUT http://localhost:3000/api/db/projects/proj-1 \
    -H "Content-Type: application/json" \
    -d '{"budget":2200}'
  ```
- **Delete Project (DELETE)**:
  ```bash
  curl -X DELETE http://localhost:3000/api/db/projects/proj-1
  ```
- **Create Application (CREATE)**:
  ```bash
  curl -X POST http://localhost:3000/api/db/applications \
    -H "Content-Type: application/json" \
    -d '{"projectId":"proj-2","projectTitle":"Campus Event Website","clientName":"Tech Summit","budget":"₹2000"}'
  ```
- **Update Application Status (UPDATE)**:
  ```bash
  curl -X PATCH http://localhost:3000/api/db/applications/app-101/status \
    -H "Content-Type: application/json" \
    -d '{"status":"Accepted"}'
  ```
- **Delete Application (DELETE)**:
  ```bash
  curl -X DELETE http://localhost:3000/api/db/applications/app-101
  ```

---

## 👥 Project Team & Contributors
- **Harshit Yadav** (`@harshitwsh`) - Core Architecture (`app.js`, `common.css`), Express & MongoDB Server (`server.js`), Profile Step 1, Student Dashboard, Messaging & `user_profile.json`
- **Tamish Mehlawat** (`@mehlawattamish-art`) - Landing Page (`index.html`/`skillx.html`), Profile Step 2, Project Details & Evaluation Suite (`api-explorer.html`)
- **Aviraj** (`@sviraj-vsc`) - Find Work Marketplace, Profile Step 3, Application Proposal Form, `projects.json` & `applications.json`
- **Vansh Arora** (`@vansharoravka`) - Authentication (`login.html`), Why Us Pipeline, Applications Tracker, Settings Page & Project Documentation
