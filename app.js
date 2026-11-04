/**
 * SKILLX - Shared Core JavaScript (app.js)
 * Simple shared helpers for storage, validation, JSON file export, and notifications.
 */

const STORAGE_KEYS = {
  APPLICATIONS: 'skillx_applications',
  PROJECTS: 'skillx_projects',
  USER_PROFILE: 'skillx_user_profile',
  USER_ACCOUNT: 'skillx_user_account',
  MESSAGES: 'skillx_messages',
  SETTINGS: 'skillx_settings'
};

// Default student profile (synced with data/user_profile.json)
const DEFAULT_USER_PROFILE = {
  name: 'Tanish Mehlawat',
  email: 'tanish@campus.edu',
  role: 'Student',
  headline: 'Junior Full-Stack React & Node.js Developer',
  college: 'Campus Engineering Institute',
  location: 'New Delhi, India (IST)',
  batch: "Batch of '26",
  verifiedStudent: true,
  experienceLevel: 'Junior',
  skills: ['React', 'TypeScript', 'Node.js', 'Figma'],
  bio: 'Computer Science student at Campus Engineering Institute specializing in React web applications, Node.js REST APIs, and clean responsive UI/UX systems for student clubs and startups.',
  links: {
    github: 'https://github.com/tanish-dev',
    linkedin: 'https://linkedin.com/in/tanish-mehlawat',
    website: 'https://tanish.dev',
    twitter: 'https://x.com/tanish_codes'
  },
  hourlyRate: { min: 50, max: 100, currency: 'USD' },
  availability: 'Available',
  timezone: 'IST',
  avatar: ''
};

// Default app notification & privacy preferences
const DEFAULT_SETTINGS = {
  emailNotifications: true,
  projectAlerts: true,
  messageAlerts: true,
  profilePublic: true,
  digestFrequency: 'Weekly'
};

// Default campus project listings (synced with data/projects.json)
const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Campus Club Event Registration Web App',
    category: 'Web Development',
    budget: 2000,
    duration: '2 Weeks',
    level: 'Intermediate',
    applicants: 12,
    deadline: '30 November 2026',
    client: { name: 'Robotics Club', verified: true, rating: '4.8/5' },
    description: 'We need a responsive portal for university student societies to manage event tickets, check-ins and memberships.',
    skills: ['React', 'Tailwind CSS', 'Firebase'],
    badge: 'Verified Campus Organizer',
    timeRemaining: '2 days left',
    postedText: 'Posted 2 hours ago by Robotics Club'
  },
  {
    id: 'proj-2',
    title: 'Campus Event Website',
    category: 'Web Development',
    budget: 2000,
    duration: '2 Weeks',
    level: 'Beginner to Intermediate',
    applicants: 8,
    deadline: '15 December 2026',
    client: { name: 'Annual Tech Summit Core Team', verified: true, rating: '4.9/5' },
    description: 'Build a modern single-page event landing page with registration form for the annual tech summit. Responsive layout required.',
    skills: ['Web Development', 'HTML/Tailwind', 'JavaScript'],
    badge: 'Verified Campus Organizer',
    timeRemaining: '2 days left',
    postedText: 'Posted 3 hours ago by Tech Summit Team'
  },
  {
    id: 'proj-3',
    title: 'UI/UX Design Project',
    category: 'Design & Creative',
    budget: 2500,
    duration: '1 Week',
    level: 'Intermediate',
    applicants: 15,
    deadline: '25 November 2026',
    client: { name: 'College Fest Core Team', verified: true, rating: '4.7/5' },
    description: 'Need high-fidelity Figma screens and interactive micro-prototype for our inter-college festival schedule & passes app.',
    skills: ['Figma', 'Mobile App Prototype', 'Design System'],
    badge: 'Urgent',
    timeRemaining: '3 days left',
    postedText: 'Posted 5 hours ago by College Fest Core Team'
  },
  {
    id: 'proj-4',
    title: 'Python Automation Task',
    category: 'Data & Python',
    budget: 1800,
    duration: '1 Week',
    level: 'Intermediate',
    applicants: 6,
    deadline: '28 November 2026',
    client: { name: 'Campus AI & Data Research Lab', verified: true, rating: '5.0/5' },
    description: 'Clean and extract tabular statistics from PDF research reports into structured CSV format using Python / BeautifulSoup / Pandas.',
    skills: ['Python', 'Data Scraping', 'Pandas'],
    badge: 'Research Lab',
    timeRemaining: 'Quick Delivery',
    postedText: 'Posted 1 day ago by Campus Research Lab'
  },
  {
    id: 'proj-5',
    title: 'Student Attendance System',
    category: 'Web Development',
    budget: 1500,
    duration: '2 Weeks',
    level: 'Intermediate',
    applicants: 9,
    deadline: '05 December 2026',
    client: { name: 'CS Department Lab Assistant', verified: true, rating: '4.6/5' },
    description: 'Develop a lightweight QR-based student attendance logger with export to Excel/CSV for lab sessions.',
    skills: ['React', 'Firebase'],
    badge: 'Verified Campus',
    timeRemaining: '5 days left',
    postedText: 'Posted 1 day ago by CS Lab Assistant'
  },
  {
    id: 'proj-6',
    title: 'College Fest Website',
    category: 'Web Development',
    budget: 2500,
    duration: '3 Weeks',
    level: 'Advanced',
    applicants: 20,
    deadline: '10 December 2026',
    client: { name: 'Student Council', verified: true, rating: '4.9/5' },
    description: 'Official portal for annual college cultural fest including competitions registration, artist lineup, and live social feed.',
    skills: ['React', 'Tailwind CSS'],
    badge: 'College Fest',
    timeRemaining: '1 week left',
    postedText: 'Posted 2 days ago by Student Council'
  },
  {
    id: 'proj-7',
    title: 'Hostel Management App',
    category: 'App Development',
    budget: 2200,
    duration: '2 Weeks',
    level: 'Intermediate',
    applicants: 11,
    deadline: '12 December 2026',
    client: { name: 'Campus Residential Board', verified: true, rating: '4.8/5' },
    description: 'Hostel room allocation and maintenance ticketing mobile/web app for university residents with room inventory and complaint escalation.',
    skills: ['React', 'Firebase'],
    badge: 'Verified',
    timeRemaining: '2 weeks left',
    postedText: 'Posted 2 days ago by Residential Board'
  },
  {
    id: 'proj-8',
    title: 'Tech Blog & Newsletter Writer',
    category: 'Content Writing',
    budget: 1200,
    duration: '1 Week',
    level: 'Beginner to Intermediate',
    applicants: 5,
    deadline: '29 November 2026',
    client: { name: 'Campus Entrepreneurship Cell', verified: true, rating: '4.9/5' },
    description: 'Write 4 engaging technical blog posts and weekly founder newsletters showcasing campus startup launches and hackathon winners.',
    skills: ['Technical Writing', 'SEO', 'Copywriting'],
    badge: 'Verified Club',
    timeRemaining: '4 days left',
    postedText: 'Posted 2 days ago by E-Cell Team'
  },
  {
    id: 'proj-9',
    title: 'CI/CD Pipeline & Docker Setup',
    category: 'DevOps',
    budget: 2400,
    duration: '1 Week',
    level: 'Intermediate',
    applicants: 4,
    deadline: '02 December 2026',
    client: { name: 'Open Source Campus Club', verified: true, rating: '4.8/5' },
    description: 'Containerize our student timetable API with Docker and configure GitHub Actions automated test and deployment workflows.',
    skills: ['Docker', 'GitHub Actions', 'Nginx'],
    badge: 'Open Source',
    timeRemaining: '5 days left',
    postedText: 'Posted 3 days ago by Open Source Club'
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-101',
    projectId: 'proj-1',
    projectTitle: 'Campus Club Event Registration Web App',
    clientName: 'Robotics Club',
    budget: '₹2000',
    submittedAt: '2026-10-31T14:30:00.000Z',
    status: 'Under Review',
    coverLetter: 'Hello Robotics Club team! I have built several campus registration portals with QR ticket verification and dynamic attendance check-in. Excited to bring this to life for your society within 2 weeks.',
    portfolioLink: 'https://github.com/tanish-dev/campus-events',
    fileName: 'tanish_sample_work.pdf',
    estimatedDelivery: '2 Weeks',
    termsAgreed: true
  }
];

function initializeData() {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
    }

    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];
    if (!Array.isArray(parsedProjects) || parsedProjects.length < DEFAULT_PROJECTS.length) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}
initializeData();

// --- Data Accessors ---

function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
}

function getProjectById(id) {
  const projects = getProjects();
  return projects.find(p => p.id === id) || projects[0];
}

function getApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : DEFAULT_APPLICATIONS;
  } catch (e) {
    return DEFAULT_APPLICATIONS;
  }
}

function saveApplication(appData) {
  const current = getApplications();
  current.unshift(appData);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(current));
  return current;
}

function deleteApplication(appId) {
  const updated = getApplications().filter(app => app.id !== appId);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
  return updated;
}

function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const saved = raw ? JSON.parse(raw) : {};
    return Object.assign({}, DEFAULT_USER_PROFILE, saved);
  } catch (e) {
    return Object.assign({}, DEFAULT_USER_PROFILE);
  }
}

function saveProfile(partialData) {
  const current = getProfile();
  const updated = Object.assign({}, current, partialData);
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));

  // Keep signed-in account summary in sync with edited profile details
  const account = getAccount();
  if (account) {
    const syncedAccount = Object.assign({}, account, {
      name: updated.name || account.name,
      email: updated.email || account.email,
      role: updated.role || account.role,
      batch: updated.batch || account.batch
    });
    localStorage.setItem(STORAGE_KEYS.USER_ACCOUNT, JSON.stringify(syncedAccount));
  }
  return updated;
}

function getAccount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_ACCOUNT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveAccount(accountData) {
  localStorage.setItem(STORAGE_KEYS.USER_ACCOUNT, JSON.stringify(accountData));
  return accountData;
}

function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const saved = raw ? JSON.parse(raw) : {};
    return Object.assign({}, DEFAULT_SETTINGS, saved);
  } catch (e) {
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

function saveSettings(partialSettings) {
  const updated = Object.assign({}, getSettings(), partialSettings);
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  initializeData();
}

function getCurrentUserName() {
  const profile = getProfile();
  if (profile && profile.name && profile.name.trim()) return profile.name.trim();
  const account = getAccount();
  if (account && account.name && account.name.trim()) return account.name.trim();
  return DEFAULT_USER_PROFILE.name;
}

function getDefaultAvatar(name) {
  const safeName = String(name || 'TM').replace(/[^a-zA-Z\s]/g, '').trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'TM');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#eff6ff"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="700" fill="#2563eb">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// --- Shared Security & Validation Helpers ---

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function isValidUrl(url) {
  try {
    const parsed = new URL(String(url).trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function getErrorAnchor(inputEl) {
  const iconParent = inputEl.closest('.input-with-icon') || inputEl.closest('.textarea-wrapper');
  return iconParent || inputEl;
}

function clearFieldError(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove('input-error');
  const anchor = getErrorAnchor(inputEl);
  const next = anchor.nextElementSibling;
  if (next && next.classList.contains('field-error-text')) {
    next.remove();
  }
}

function setFieldError(inputEl, message) {
  if (!inputEl) return;
  clearFieldError(inputEl);
  inputEl.classList.add('input-error');

  const errorSpan = document.createElement('span');
  errorSpan.className = 'field-error-text';
  errorSpan.textContent = message;

  const anchor = getErrorAnchor(inputEl);
  anchor.insertAdjacentElement('afterend', errorSpan);

  // Clear automatically once the user types again
  inputEl.addEventListener('input', () => clearFieldError(inputEl), { once: true });
}

// --- Local JSON Download & Optional Server Sync ---

function downloadJSON(data, filename = 'data.json') {
  const jsonText = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonText], { type: 'application/json' });
  const blobUrl = URL.createObjectURL(blob);

  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = blobUrl;
  downloadAnchor.download = filename;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

async function trySyncToServer(endpoint, data) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// --- Toast Notification Utility ---

function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb';
  toast.style.cssText = `background:${bg};color:#fff;padding:12px 20px;border-radius:8px;font-size:0.9rem;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.18);display:flex;align-items:center;gap:8px;opacity:0;transform:translateY(10px);transition:all 0.25s ease;`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '!' : 'i';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}
