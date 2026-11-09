/**
 * SKILLX - Applications Tracker JavaScript (applications.js)
 * Handles filtering, search, withdraw actions, and local JSON import/export.
 */

let currentFilter = 'All';
let searchQuery = '';

function renderApplications() {
  const container = document.getElementById('applicationsContainer');
  if (!container) return;

  const apps = getApplications();

  // Update pill counters
  document.getElementById('countAll').textContent = apps.length;
  document.getElementById('countReview').textContent = apps.filter(a => a.status === 'Under Review').length;
  document.getElementById('countShortlisted').textContent = apps.filter(a => a.status === 'Shortlisted').length;
  document.getElementById('countAccepted').textContent = apps.filter(a => a.status === 'Accepted').length;

  const filtered = apps.filter(app => {
    const matchesStatus = (currentFilter === 'All') || (app.status === currentFilter);
    const haystack = `${app.projectTitle} ${app.clientName} ${app.coverLetter}`.toLowerCase();
    const matchesSearch = !searchQuery || haystack.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <span class="material-symbols-outlined">inbox</span>
        <h3>No applications found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">You haven't submitted any proposals matching this criteria.</p>
        <a href="find-work.html" class="btn btn-royal" style="margin-top: 18px;">Find Projects to Apply</a>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(app => {
    const dateFormatted = new Date(app.submittedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    const statusClass = app.status === 'Accepted' ? 'accepted' : app.status === 'Shortlisted' ? 'shortlisted' : 'review';

    return `
      <article class="application-card">
        <div class="app-card-top-line">
          <div>
            <h3>${escapeHtml(app.projectTitle)}</h3>
            <div class="app-client-sub">Client: <strong>${escapeHtml(app.clientName)}</strong> &bull; Submitted: ${dateFormatted}</div>
          </div>
          <span class="app-status-badge ${statusClass}">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
            <span>${escapeHtml(app.status)}</span>
          </span>
        </div>

        <div class="app-cover-preview">
          <strong style="color: var(--text-main); display: block; margin-bottom: 4px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Proposal Excerpt:</strong>
          "${escapeHtml(app.coverLetter)}"
        </div>

        <div class="app-meta-details-row">
          <div class="app-meta-items">
            <span>Budget: <strong style="color: var(--brand-green);">${escapeHtml(app.budget)}</strong></span>
            <span>Est. Delivery: <strong>${escapeHtml(app.estimatedDelivery)}</strong></span>
            <span>Portfolio: <a href="${escapeHtml(app.portfolioLink)}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-blue); text-decoration: underline;">${escapeHtml(app.portfolioLink)}</a></span>
            ${app.fileName && app.fileName !== 'No file attached' ? `<span>Attachment: ${escapeHtml(app.fileName)}</span>` : ''}
          </div>

          <div class="app-action-buttons">
            <button type="button" class="btn-json-dl" data-download-id="${escapeHtml(app.id)}">
              <span class="material-symbols-outlined" style="font-size: 16px;">file_download</span>
              <span>Save JSON</span>
            </button>
            <button type="button" class="btn-json-dl" data-delete-id="${escapeHtml(app.id)}" style="color: #ef4444;">
              <span class="material-symbols-outlined" style="font-size: 16px;">delete_outline</span>
              <span>Withdraw</span>
            </button>
            <a href="project-details.html?id=${encodeURIComponent(app.projectId)}" class="btn-json-dl" style="color: var(--text-main);">
              <span>View Project</span>
              <span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Bind card action buttons cleanly
  container.querySelectorAll('[data-download-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-download-id');
      const found = getApplications().find(a => a.id === id);
      if (found) {
        downloadJSON(found, `application_${found.id}.json`);
        showToast(`Downloaded application_${found.id}.json`, 'success');
      }
    });
  });

  container.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-id');
      deleteApplication(id);
      renderApplications();
      showToast('Application withdrawn from your local tracker.', 'info');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check redirect toast after application submission
  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === 'true') {
    showToast('Proposal submitted! Saved in local storage & JSON downloaded.', 'success');
  }

  // 2. Status Filter Pills
  document.querySelectorAll('.filter-pill-btn[data-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-status');
      document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderApplications();
    });
  });

  // 3. Search Box
  const searchInput = document.getElementById('appSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderApplications();
    });
  }

  // 4. Bulk Export JSON
  const exportBtn = document.getElementById('exportAllBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      downloadJSON(getApplications(), 'applications.json');
      showToast('Downloaded full applications.json file!', 'success');
    });
  }

  // 5. Import JSON Trigger & Validation
  const importBtn = document.getElementById('importJsonBtn');
  const importInput = document.getElementById('importJsonInput');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());

    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const incoming = Array.isArray(parsed) ? parsed : [parsed];
          const validItems = incoming.filter(item => item && item.id && item.projectTitle);

          if (validItems.length === 0) {
            showToast('Invalid JSON format: expected application objects.', 'error');
            return;
          }

          const current = getApplications();
          const existingIds = new Set(current.map(a => a.id));
          const uniqueNew = validItems.filter(item => !existingIds.has(item.id));
          const merged = [...uniqueNew, ...current];

          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(merged));
          renderApplications();
          showToast(`Imported ${uniqueNew.length} application(s) successfully!`, 'success');
        } catch (err) {
          showToast('Failed to parse JSON file: ' + err.message, 'error');
        } finally {
          importInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

  // 6. Footer Toast Links
  document.querySelectorAll('.footer-nav a[data-toast]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(link.getAttribute('data-toast'), 'info');
    });
  });

  renderApplications();
});
