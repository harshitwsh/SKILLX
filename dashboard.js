/**
 * SKILLX - Student Dashboard JavaScript (dashboard.js)
 * Personalizes greeting/stats, handles suggested project search filter, and quick navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalize Greeting & User Chip from Local Storage
  const userName = getCurrentUserName();
  const profile = getProfile();

  const greetingEl = document.getElementById('welcomeHeading');
  const chipNameEl = document.getElementById('chipUserName');
  const chipRoleEl = document.getElementById('chipUserRole');
  const chipAvatarEl = document.getElementById('chipUserAvatar');
  const badgeBatchEl = document.querySelector('.student-badge-card .badge-info p');

  if (greetingEl) greetingEl.textContent = `Welcome to SKILLX, ${userName} 👋`;
  if (chipNameEl) chipNameEl.textContent = userName;
  if (chipRoleEl) chipRoleEl.textContent = profile.role || 'Student';
  if (badgeBatchEl) badgeBatchEl.textContent = profile.batch || "Batch of '26";
  if (chipAvatarEl) {
    chipAvatarEl.src = profile.avatar || getDefaultAvatar(userName);
  }

  // 2. Refresh Active Applications Count & Subtext
  const apps = getApplications();
  const activeCount = apps.filter(a => a.status === 'Active' || a.status === 'Under Review' || a.status === 'Shortlisted').length;
  const acceptedCount = apps.filter(a => a.status === 'Accepted').length;

  const countEl = document.getElementById('dashActiveProjectsCount');
  const subtextEl = document.getElementById('dashActiveSubtext');
  const completedEl = document.getElementById('dashCompletedCount');

  if (countEl) countEl.textContent = activeCount;
  if (subtextEl) {
    subtextEl.textContent = activeCount > 0
      ? `${activeCount} active proposal${activeCount > 1 ? 's' : ''} in progress`
      : 'No ongoing gigs yet';
  }
  if (completedEl) completedEl.textContent = acceptedCount;

  // 3. Live Search Filter for Suggested Projects
  const searchInput = document.getElementById('dashboardSearchInput');
  const container = document.getElementById('suggestedProjectsContainer');

  if (searchInput && container) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const cards = container.querySelectorAll('.suggested-item-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const keywords = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent;
        const matched = !q || keywords.toLowerCase().includes(q);
        card.style.display = matched ? 'flex' : 'none';
        if (matched) visibleCount++;
      });

      let emptyBox = document.getElementById('dashSearchEmpty');
      if (visibleCount === 0) {
        if (!emptyBox) {
          emptyBox = document.createElement('div');
          emptyBox.id = 'dashSearchEmpty';
          emptyBox.className = 'suggested-item-card';
          emptyBox.style.cssText = 'justify-content:center;flex-direction:column;align-items:center;text-align:center;padding:32px;gap:10px;';
          emptyBox.innerHTML = `
            <span class="material-symbols-outlined" style="font-size:34px;color:var(--text-light);">search_off</span>
            <p style="margin:0;color:var(--text-muted);font-size:0.9rem;">No suggested projects match your search.</p>
            <a href="find-work.html" class="btn btn-royal" style="padding:8px 16px;font-size:0.85rem;">Browse All Projects</a>
          `;
          container.appendChild(emptyBox);
        }
        emptyBox.style.display = 'flex';
      } else if (emptyBox) {
        emptyBox.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) window.location.href = `find-work.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  // 4. Quick Action Cards & Topbar Chip Navigation
  document.querySelectorAll('[data-href]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      window.location.href = el.getAttribute('data-href');
    });
  });

  // 5. Notifications & Settings Click Handlers
  const notifyBtn = document.getElementById('notificationBtn');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
      const dot = notifyBtn.querySelector('.notif-dot');
      if (dot) dot.style.display = 'none';
      showToast('You have 1 new project match from Robotics Club!', 'info');
    });
  }

  // Settings link navigates cleanly to settings.html
});
