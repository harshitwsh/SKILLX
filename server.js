/**
 * SKILLX - Production Express Server (server.js)
 *
 * 3rd Evaluation Parameters Fulfilled:
 * 1. Fetching and showing data via External APIs calls (Currency converter, GitHub Profile, Tech Quotes)
 * 2. Node & Express setup (Express 5, CORS, JSON/URLencoded parser, Logger, Static Server)
 * 3. Express APIs creation to save/fetch data to local JSON files (/api/json/* & compatibility routes)
 * 4. Full CRUD operations using Express APIs to manage data in MongoDB Atlas (/api/db/*)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const Project = require('./models/Project');
const Application = require('./models/Application');
const Profile = require('./models/Profile');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://teamsftgym_db_user:giAPYPupc04qfZUw@cluster0.nktdewv.mongodb.net/backend_db?retryWrites=true&w=majority';

const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = __dirname;

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ============================================================================
// ⚙️ PARAMETER 2: Node and Express Server Setup
// ============================================================================
// Features implemented for Parameter 2:
//   - Express 5.3 server instance (const app = express())
//   - Environment variables configuration (dotenv)
//   - CORS Cross-Origin Resource Sharing middleware (app.use(cors()))
//   - JSON body parser (app.use(express.json()))
//   - URL-encoded form data parser (app.use(express.urlencoded({ extended: true })))
//   - Custom request logger middleware for response time & status monitoring
//   - Health check & diagnostics endpoint (GET /api/health)
//   - Static file server for client assets (app.use(express.static(__dirname)))
//   - Process listener on port (process.env.PORT || 3000)
// ============================================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Helper functions for Local JSON storage
function readLocalJson(filename, defaultData = []) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

function writeLocalJson(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// ==========================================
// MongoDB Connection & Auto-Seed Logic
// ==========================================
let isMongoConnected = false;

async function autoSeedDatabase() {
  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const localProjects = readLocalJson('projects.json', []);
      if (localProjects.length > 0) {
        await Project.insertMany(localProjects);
        console.log(`[MongoDB Auto-Seed] Inserted ${localProjects.length} initial projects from projects.json.`);
      }
    }

    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      const localApps = readLocalJson('applications.json', []);
      if (localApps.length > 0) {
        await Application.insertMany(localApps);
        console.log(`[MongoDB Auto-Seed] Inserted ${localApps.length} initial applications from applications.json.`);
      }
    }

    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      const localProfile = readLocalJson('user_profile.json', null);
      if (localProfile) {
        await Profile.create(localProfile);
        console.log('[MongoDB Auto-Seed] Inserted initial profile from user_profile.json.');
      }
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUsers = [
        { name: 'Tanish Mehlawat', email: 'tanish@campus.edu', role: 'Student', batch: "Batch of '26", college: 'Campus Engineering Institute' },
        { name: 'Harshit Yadav', email: 'harshit@campus.edu', role: 'Freelancer', batch: "Batch of '25", college: 'Campus Engineering Institute' },
        { name: 'Robotics Club Organizer', email: 'club@campus.edu', role: 'Client', batch: "Campus Club", college: 'Campus Engineering Institute' }
      ];
      await User.insertMany(defaultUsers);
      console.log(`[MongoDB Auto-Seed] Inserted ${defaultUsers.length} verified users into MongoDB users collection.`);
    }
  } catch (seedErr) {
    console.warn('[MongoDB Auto-Seed] Warning during initial seed:', seedErr.message);
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('----------------------------------------------------');
    console.log('[MongoDB Atlas] Connected successfully to: backend_db');
    console.log('----------------------------------------------------');
    autoSeedDatabase();
  })
  .catch((err) => {
    isMongoConnected = false;
    console.error('[MongoDB Atlas Connection Error]', err.message);
  });

// ----------------------------------------------------------------------------
// [PARAMETER 2 CONTINUED] Diagnostics Health & Server Status Endpoint
// ----------------------------------------------------------------------------
// Route: GET /api/health
// Purpose: Confirms Express 5 server is alive, reports uptime, and shows MongoDB state
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      database: mongoose.connection.name || 'backend_db'
    },
    version: '1.0.0'
  });
});

// ============================================================================
// 🌐 PARAMETER 1: Fetching and Showing Data via External APIs Calls
// ============================================================================
// 1. GET /api/external/currency          -> Live Currency Exchange Rates (open.er-api.com)
// 2. GET /api/external/github/:username  -> Live Student GitHub Profile Verifier (api.github.com)
// 3. GET /api/external/quote             -> Daily Motivational Dev Quote (dummyjson.com)
// ============================================================================

// External API: Real-time Currency Converter
app.get('/api/external/currency', async (req, res) => {
  try {
    const base = req.query.base || 'INR';
    // Free open exchange rates API
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!response.ok) {
      throw new Error(`Exchange rate API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.json({
      success: true,
      provider: 'open.er-api.com',
      base: data.base_code,
      updatedAt: data.time_last_update_utc,
      rates: {
        USD: data.rates.USD,
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        INR: data.rates.INR,
        AED: data.rates.AED,
        CAD: data.rates.CAD
      }
    });
  } catch (err) {
    console.warn('[External API] Currency fetch fallback:', err.message);
    // Reliable static fallback in case of no outbound network
    res.json({
      success: true,
      fallback: true,
      base: 'INR',
      updatedAt: new Date().toISOString(),
      rates: {
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0095,
        INR: 1.0,
        AED: 0.044,
        CAD: 0.016
      }
    });
  }
});

// External API: Real-time GitHub Profile Verifier
app.get('/api/external/github/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'SKILLX-Campus-Freelance-Platform'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({ success: false, message: `GitHub user '${username}' not found.` });
    }

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      username: data.login,
      name: data.name || data.login,
      bio: data.bio || 'Campus Developer',
      avatarUrl: data.avatar_url,
      profileUrl: data.html_url,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      company: data.company,
      location: data.location
    });
  } catch (err) {
    console.warn('[External API] GitHub fetch error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to contact GitHub API: ' + err.message
    });
  }
});

// External API: Motivational Dev Quote
app.get('/api/external/quote', async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (response.ok) {
      const data = await response.json();
      return res.json({ success: true, quote: data.quote, author: data.author });
    }
  } catch (e) {
    // Fallback
  }
  res.json({
    success: true,
    quote: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson'
  });
});

// ============================================================================
// 💾 PARAMETER 3: Express APIs Creation to Save/Fetch Data to Local JSON Files
// ============================================================================
// Reads and writes persisted data directly into local files inside data/*.json:
//   - GET    /api/json/projects          -> Reads data/projects.json
//   - POST   /api/json/projects          -> Appends new project to data/projects.json
//   - GET    /api/json/applications      -> Reads data/applications.json
//   - POST   /api/json/applications      -> Appends proposal to data/applications.json
//   - DELETE /api/json/applications/:id  -> Removes proposal from data/applications.json
//   - GET    /api/json/profile           -> Reads data/user_profile.json
//   - POST   /api/json/profile           -> Saves profile to data/user_profile.json
//   - POST   /api/save-application       -> Dual-sync to JSON & MongoDB
//   - POST   /api/save-profile           -> Dual-sync to JSON & MongoDB
// ============================================================================

// GET /api/json/projects -> Fetch all projects from data/projects.json
app.get('/api/json/projects', (req, res) => {
  const projects = readLocalJson('projects.json', []);
  res.json({ success: true, count: projects.length, data: projects });
});

// POST /api/json/projects -> Create/Add new project to data/projects.json
app.post('/api/json/projects', (req, res) => {
  const newProject = req.body;
  if (!newProject || !newProject.title) {
    return res.status(400).json({ success: false, error: 'Project title is required' });
  }
  newProject.id = newProject.id || `proj-${Date.now()}`;
  const projects = readLocalJson('projects.json', []);
  projects.unshift(newProject);
  writeLocalJson('projects.json', projects);
  res.status(201).json({ success: true, message: 'Saved to data/projects.json', data: newProject });
});

// GET /api/json/applications -> Fetch all applications from data/applications.json
app.get('/api/json/applications', (req, res) => {
  const apps = readLocalJson('applications.json', []);
  res.json({ success: true, count: apps.length, data: apps });
});

// POST /api/json/applications -> Append application to data/applications.json
app.post('/api/json/applications', (req, res) => {
  const newApp = req.body;
  if (!newApp) {
    return res.status(400).json({ success: false, error: 'Application data is required' });
  }
  newApp.id = newApp.id || `app-${Date.now()}`;
  newApp.submittedAt = newApp.submittedAt || new Date().toISOString();
  newApp.status = newApp.status || 'Under Review';

  const apps = readLocalJson('applications.json', []);
  apps.unshift(newApp);
  writeLocalJson('applications.json', apps);
  res.status(201).json({ success: true, message: 'Saved to data/applications.json', data: newApp });
});

// DELETE /api/json/applications/:id -> Delete application from data/applications.json
app.delete('/api/json/applications/:id', (req, res) => {
  const { id } = req.params;
  const apps = readLocalJson('applications.json', []);
  const initialLen = apps.length;
  const filtered = apps.filter((a) => a.id !== id);

  if (filtered.length === initialLen) {
    return res.status(404).json({ success: false, error: `Application '${id}' not found in local JSON.` });
  }

  writeLocalJson('applications.json', filtered);
  res.json({ success: true, message: `Application '${id}' deleted from data/applications.json.` });
});

// GET /api/json/profile -> Fetch user profile from data/user_profile.json
app.get('/api/json/profile', (req, res) => {
  const profile = readLocalJson('user_profile.json', {});
  res.json({ success: true, data: profile });
});

// POST /api/json/profile -> Save/Update user profile in data/user_profile.json
app.post('/api/json/profile', (req, res) => {
  const profileData = req.body;
  if (!profileData) {
    return res.status(400).json({ success: false, error: 'Profile data is required' });
  }
  writeLocalJson('user_profile.json', profileData);
  res.json({ success: true, message: 'Saved to data/user_profile.json', data: profileData });
});

// Backward-Compatibility Routes (Used by existing frontend scripts)
app.post('/api/save-application', async (req, res) => {
  const newApp = req.body;
  newApp.id = newApp.id || `app-${Date.now()}`;
  newApp.submittedAt = newApp.submittedAt || new Date().toISOString();
  newApp.status = newApp.status || 'Under Review';

  // 1. Save to local JSON
  const apps = readLocalJson('applications.json', []);
  apps.unshift(newApp);
  writeLocalJson('applications.json', apps);

  // 2. Also save to MongoDB if connected
  let mongoSaved = false;
  try {
    if (mongoose.connection.readyState === 1) {
      await Application.findOneAndUpdate({ id: newApp.id }, newApp, { upsert: true, new: true });
      mongoSaved = true;
    }
  } catch (e) {
    console.warn('MongoDB sync warning on save-application:', e.message);
  }

  res.json({
    success: true,
    message: 'Application recorded successfully',
    savedToLocalJson: true,
    savedToMongoDB: mongoSaved,
    data: newApp
  });
});

app.post('/api/save-profile', async (req, res) => {
  const profileData = req.body;

  // 1. Save to local JSON
  writeLocalJson('user_profile.json', profileData);

  // 2. Also save to MongoDB if connected
  let mongoSaved = false;
  try {
    if (mongoose.connection.readyState === 1) {
      const email = profileData.email || 'tanish@campus.edu';
      await Profile.findOneAndUpdate({ email }, profileData, { upsert: true, new: true });
      mongoSaved = true;
    }
  } catch (e) {
    console.warn('MongoDB sync warning on save-profile:', e.message);
  }

  res.json({
    success: true,
    message: 'Profile recorded successfully',
    savedToLocalJson: true,
    savedToMongoDB: mongoSaved,
    data: profileData
  });
});

app.get('/api/applications', (req, res) => {
  const apps = readLocalJson('applications.json', []);
  res.json(apps);
});

app.get('/api/projects', (req, res) => {
  const projects = readLocalJson('projects.json', []);
  res.json(projects);
});

// ============================================================================
// 🗄️ PARAMETER 4: CRUD Operations Using Express APIs to Manage Data in MongoDB
// ============================================================================
// Connected to MongoDB Atlas Cloud Database: 'backend_db'
// Collections: projects, applications, profiles, users
//
// PROJECTS CRUD:
//   - CREATE : POST   /api/db/projects            (Inserts new gig into Atlas)
//   - READ   : GET    /api/db/projects            (Reads all gigs with filter/search)
//   - READ 1 : GET    /api/db/projects/:id        (Reads single gig by ID)
//   - UPDATE : PUT    /api/db/projects/:id        (Updates gig in Atlas)
//   - DELETE : DELETE /api/db/projects/:id        (Deletes gig from Atlas)
//
// APPLICATIONS CRUD:
//   - CREATE : POST   /api/db/applications        (Submits new proposal to Atlas)
//   - READ   : GET    /api/db/applications        (Reads all proposals from Atlas)
//   - READ 1 : GET    /api/db/applications/:id    (Reads single proposal by ID)
//   - UPDATE : PUT    /api/db/applications/:id    (Updates proposal)
//   - STATUS : PATCH  /api/db/applications/:id/status (Updates review status)
//   - DELETE : DELETE /api/db/applications/:id    (Withdraws/deletes proposal)
//
// USERS & PROFILE CRUD:
//   - READ   : GET    /api/db/users               (Reads verified users)
//   - CREATE : POST   /api/db/users               (Registers new user)
//   - DELETE : DELETE /api/db/users/:id           (Deletes user)
//   - READ   : GET    /api/db/profile             (Reads student profile)
//   - UPDATE : PUT    /api/db/profile             (Updates student profile)
// ============================================================================

// --- PROJECTS CRUD ---

// CREATE Project: POST /api/db/projects
app.post('/api/db/projects', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category || !data.budget) {
      return res.status(400).json({ success: false, error: 'title, category, and budget are required.' });
    }
    data.id = data.id || `proj-${Date.now()}`;
    const project = new Project(data);
    await project.save();
    res.status(201).json({ success: true, message: 'Project created in MongoDB', data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ ALL Projects: GET /api/db/projects (supports ?category= and ?search=)
app.get('/api/db/projects', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') }
      ];
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// READ ONE Project: GET /api/db/projects/:id
app.get('/api/db/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = (await Project.findOne({ id })) || (mongoose.Types.ObjectId.isValid(id) ? await Project.findById(id) : null);
    if (!project) {
      return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE Project: PUT /api/db/projects/:id
app.put('/api/db/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    let project = await Project.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    if (!project && mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
    if (!project) {
      return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
    }
    res.json({ success: true, message: 'Project updated in MongoDB', data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE Project: DELETE /api/db/projects/:id
app.delete('/api/db/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Project.findOneAndDelete({ id });
    if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Project.findByIdAndDelete(id);
    }
    if (!deleted) {
      return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
    }
    res.json({ success: true, message: `Project '${id}' deleted from MongoDB`, data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- APPLICATIONS CRUD ---

// CREATE Application: POST /api/db/applications
app.post('/api/db/applications', async (req, res) => {
  try {
    const data = req.body;
    if (!data.projectId || !data.projectTitle) {
      return res.status(400).json({ success: false, error: 'projectId and projectTitle are required.' });
    }
    data.id = data.id || `app-${Date.now()}`;
    data.submittedAt = data.submittedAt || new Date();
    data.status = data.status || 'Under Review';
    const application = new Application(data);
    await application.save();

    // Increment applicant count on project if exists
    await Project.findOneAndUpdate({ id: data.projectId }, { $inc: { applicants: 1 } });

    res.status(201).json({ success: true, message: 'Application submitted to MongoDB', data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ ALL Applications: GET /api/db/applications
app.get('/api/db/applications', async (req, res) => {
  try {
    const apps = await Application.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// READ ONE Application: GET /api/db/applications/:id
app.get('/api/db/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application =
      (await Application.findOne({ id })) ||
      (mongoose.Types.ObjectId.isValid(id) ? await Application.findById(id) : null);
    if (!application) {
      return res.status(404).json({ success: false, error: `Application '${id}' not found.` });
    }
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE Application / Change Status: PUT or PATCH /api/db/applications/:id
app.put('/api/db/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    let application = await Application.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    if (!application && mongoose.Types.ObjectId.isValid(id)) {
      application = await Application.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
    if (!application) {
      return res.status(404).json({ success: false, error: `Application '${id}' not found.` });
    }
    res.json({ success: true, message: 'Application updated in MongoDB', data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.patch('/api/db/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }
    let application = await Application.findOneAndUpdate({ id }, { status }, { new: true });
    if (!application && mongoose.Types.ObjectId.isValid(id)) {
      application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    }
    if (!application) {
      return res.status(404).json({ success: false, error: `Application '${id}' not found.` });
    }
    res.json({ success: true, message: `Status updated to '${status}'`, data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE Application (Withdraw): DELETE /api/db/applications/:id
app.delete('/api/db/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Application.findOneAndDelete({ id });
    if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Application.findByIdAndDelete(id);
    }
    if (!deleted) {
      return res.status(404).json({ success: false, error: `Application '${id}' not found.` });
    }
    res.json({ success: true, message: `Application '${id}' withdrawn and deleted from MongoDB`, data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PROFILE CRUD ---

// CREATE or UPSERT Profile: POST /api/db/profile
app.post('/api/db/profile', async (req, res) => {
  try {
    const profileData = req.body;
    const email = profileData.email || 'tanish@campus.edu';
    const profile = await Profile.findOneAndUpdate({ email }, profileData, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json({ success: true, message: 'Profile saved to MongoDB', data: profile });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ Profile: GET /api/db/profile
app.get('/api/db/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne().sort({ updatedAt: -1 });
    if (!profile) {
      // Seed default profile if none exists
      profile = await Profile.create({
        name: 'Tanish Mehlawat',
        email: 'tanish@campus.edu',
        role: 'Student',
        headline: 'Junior Full-Stack React & Node.js Developer',
        batch: "Batch of '26",
        college: 'Campus Engineering Institute',
        location: 'New Delhi, India (IST)',
        verifiedStudent: true,
        skills: ['React', 'TypeScript', 'Node.js', 'Figma']
      });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE Profile: PUT /api/db/profile
app.put('/api/db/profile', async (req, res) => {
  try {
    const updateData = req.body;
    const email = updateData.email || 'tanish@campus.edu';
    const updated = await Profile.findOneAndUpdate({ email }, updateData, { new: true, upsert: true });
    res.json({ success: true, message: 'Profile updated in MongoDB', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE Profile: DELETE /api/db/profile
app.delete('/api/db/profile', async (req, res) => {
  try {
    await Profile.deleteMany({});
    res.json({ success: true, message: 'Profile collection reset in MongoDB' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- USERS CRUD ---

// READ ALL Users: GET /api/db/users
app.get('/api/db/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE User / Sign Up: POST /api/db/users
app.post('/api/db/users', async (req, res) => {
  try {
    const { name, email, password, role, batch, college } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists.' });
    }
    const user = new User({ name, email, password, role, batch, college });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered in MongoDB', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE User: DELETE /api/db/users/:id
app.delete('/api/db/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await User.findByIdAndDelete(id);
    } else {
      deleted = await User.findOneAndDelete({ email: id.toLowerCase() });
    }
    if (!deleted) {
      return res.status(404).json({ success: false, error: `User '${id}' not found.` });
    }
    res.json({ success: true, message: `User '${id}' removed from MongoDB` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Demo Reset & Re-Seed Database
app.post('/api/db/seed', async (req, res) => {
  try {
    await Project.deleteMany({});
    await Application.deleteMany({});
    await Profile.deleteMany({});
    await User.deleteMany({});

    const localProjects = readLocalJson('projects.json', []);
    const localApps = readLocalJson('applications.json', []);
    const localProfile = readLocalJson('user_profile.json', {});
    const defaultUsers = [
      { name: 'Tanish Mehlawat', email: 'tanish@campus.edu', role: 'Student', batch: "Batch of '26", college: 'Campus Engineering Institute' },
      { name: 'Harshit Yadav', email: 'harshit@campus.edu', role: 'Freelancer', batch: "Batch of '25", college: 'Campus Engineering Institute' },
      { name: 'Robotics Club Organizer', email: 'club@campus.edu', role: 'Client', batch: "Campus Club", college: 'Campus Engineering Institute' }
    ];

    if (localProjects.length) await Project.insertMany(localProjects);
    if (localApps.length) await Application.insertMany(localApps);
    if (localProfile && localProfile.email) await Profile.create(localProfile);
    await User.insertMany(defaultUsers);

    res.json({
      success: true,
      message: 'MongoDB database successfully re-seeded with all collections (Projects, Applications, Profiles, Users)!',
      seededProjects: localProjects.length,
      seededApplications: localApps.length,
      seededUsers: defaultUsers.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// [PARAMETER 2 CONTINUED] Static Client Asset Hosting & Server Listener
// ----------------------------------------------------------------------------
app.use(express.static(PUBLIC_DIR));

// Fallback route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start Express Server Process
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 SKILLX Production Express Server running on:`);
  console.log(`👉 Local:     http://localhost:${PORT}`);
  console.log(`👉 API Docs:  http://localhost:${PORT}/api-explorer.html`);
  console.log(`👉 Status:    http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

module.exports = { app, server };
