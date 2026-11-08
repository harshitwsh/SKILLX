/**
 * SKILLX - Project Details Page JavaScript (project-details.js)
 * Loads selected project details via ?id= param and navigates to proposal form.
 */

let currentProjectId = 'proj-1';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  currentProjectId = params.get('id') || 'proj-1';

  const project = getProjectById(currentProjectId);
  if (project) {
    currentProjectId = project.id;

    document.getElementById('projCategory').textContent = project.category;
    document.getElementById('projTitle').textContent = project.title;
    document.getElementById('projBudgetHighlight').textContent = `₹${project.budget} Fixed Budget`;
    document.getElementById('projClientName').textContent = project.client.name;
    document.getElementById('projRating').textContent = `Rating: ${project.client.rating}`;
    document.getElementById('projDescription').textContent = project.description;
    document.getElementById('projDeadline').textContent = project.deadline;

    // Summary Card
    document.getElementById('summaryBudget').textContent = `₹${project.budget}`;
    document.getElementById('summaryDuration').textContent = project.duration;
    document.getElementById('summaryLevel').textContent = project.level;
    document.getElementById('summaryApplicants').textContent = project.applicants;
    document.getElementById('summaryClientName').textContent = project.client.name;

    // Required Skills Pills
    const skillsContainer = document.getElementById('projSkillsList');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      (project.skills || []).forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-pill';
        span.textContent = skill;
        skillsContainer.appendChild(span);
      });
    }

    // Show subtle indicator if already applied
    const existingApp = getApplications().find(app => app.projectId === project.id);
    const applyBtn = document.getElementById('applyNowBtn');
    if (existingApp && applyBtn) {
      const note = document.createElement('p');
      note.style.cssText = 'font-size:0.78rem;color:var(--brand-green-dark);font-weight:600;text-align:center;margin-top:8px;';
      note.innerHTML = `✓ Proposal already submitted (<a href="applications.html" style="text-decoration:underline;color:inherit;">View status</a>)`;
      applyBtn.insertAdjacentElement('afterend', note);
    }
  }

  // Apply Now Navigation
  const applyBtn = document.getElementById('applyNowBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      window.location.href = `apply.html?id=${encodeURIComponent(currentProjectId)}`;
    });
  }

  // Footer toast links (prevent hash jump)
  document.querySelectorAll('.footer-nav a[data-toast]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(link.getAttribute('data-toast'), 'info');
    });
  });
});
