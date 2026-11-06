/**
 * SKILLX - Profile Creation Step 2 JavaScript (profile-creation-step-2.js)
 * Handles project tech tags, extra project slots, resume drag/drop upload, and validation.
 */

let uploadedResumeName = '';

function setResumeFile(file) {
  const dropzoneText = document.getElementById('dropzoneText');
  const resumeInput = document.getElementById('resumeFile');
  if (!file || !dropzoneText) return;

  const allowedExt = ['.pdf', '.docx', '.rtf'];
  const fileNameLower = file.name.toLowerCase();
  const isAllowed = allowedExt.some(ext => fileNameLower.endsWith(ext));

  if (!isAllowed) {
    showToast('Please upload a PDF, DOCX, or RTF file.', 'error');
    if (resumeInput) resumeInput.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Resume file size must be under 5 MB.', 'error');
    if (resumeInput) resumeInput.value = '';
    return;
  }

  uploadedResumeName = file.name;
  dropzoneText.innerHTML = `<span style="color: var(--brand-green-dark); font-weight: 700;">✓ ${escapeHtml(file.name)}</span> selected`;
  showToast('Resume attached successfully!', 'success');
}

function addExtraProjectRow(titleValue = '', urlValue = '') {
  const list = document.getElementById('extraProjectsList');
  if (!list) return;

  if (list.children.length >= 3) {
    showToast('Maximum 3 additional featured projects allowed here.', 'info');
    return;
  }

  const row = document.createElement('div');
  row.className = 'extra-project-item';
  row.style.cssText = 'border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px;background:#f8fafc;display:grid;gap:10px;';
  row.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong style="font-size:0.85rem;color:var(--text-main);">Additional Project</strong>
      <button type="button" class="remove-extra-btn" style="background:none;border:none;color:#ef4444;font-size:0.8rem;cursor:pointer;font-weight:600;">Remove</button>
    </div>
    <input type="text" class="input-control no-icon extra-proj-title" placeholder="Project Title" value="${escapeHtml(titleValue)}" />
    <input type="url" class="input-control no-icon extra-proj-url" placeholder="https://demo-link.com (optional)" value="${escapeHtml(urlValue)}" />
  `;

  row.querySelector('.remove-extra-btn').addEventListener('click', () => {
    row.remove();
  });

  list.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileStep2Form');
  const projectNameInput = document.getElementById('projectName');
  const projectDescInput = document.getElementById('projectDesc');
  const demoUrlInput = document.getElementById('demoUrl');
  const githubUrlInput = document.getElementById('githubUrl');
  const linkedinUrlInput = document.getElementById('linkedinUrl');
  const portfolioUrlInput = document.getElementById('portfolioUrl');
  const twitterUrlInput = document.getElementById('twitterUrl');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const dropzone = document.getElementById('resumeDropzone');
  const resumeInput = document.getElementById('resumeFile');

  // 1. Restore previous Step 2 values if stored
  const saved = getProfile();
  if (saved.featuredProject) {
    if (projectNameInput && saved.featuredProject.name) projectNameInput.value = saved.featuredProject.name;
    if (projectDescInput && saved.featuredProject.description) projectDescInput.value = saved.featuredProject.description;
    if (demoUrlInput && saved.featuredProject.demoUrl) demoUrlInput.value = saved.featuredProject.demoUrl;
    if (Array.isArray(saved.featuredProject.technologies)) {
      document.querySelectorAll('.tag-btn-selectable').forEach(btn => {
        btn.classList.toggle('selected', saved.featuredProject.technologies.includes(btn.textContent.trim()));
      });
    }
  }
  if (Array.isArray(saved.extraProjects)) {
    saved.extraProjects.forEach(item => addExtraProjectRow(item.title, item.url));
  }
  if (saved.links) {
    if (githubUrlInput && saved.links.github !== undefined) githubUrlInput.value = saved.links.github;
    if (linkedinUrlInput && saved.links.linkedin !== undefined) linkedinUrlInput.value = saved.links.linkedin;
    if (portfolioUrlInput && saved.links.website !== undefined) portfolioUrlInput.value = saved.links.website;
    if (twitterUrlInput && saved.links.twitter !== undefined) twitterUrlInput.value = saved.links.twitter;
  }
  if (saved.resumeFileName) {
    uploadedResumeName = saved.resumeFileName;
    const dropzoneText = document.getElementById('dropzoneText');
    if (dropzoneText) {
      dropzoneText.innerHTML = `<span style="color: var(--brand-green-dark); font-weight: 700;">✓ ${escapeHtml(uploadedResumeName)}</span> selected`;
    }
  }

  // 2. Technology Tag Toggle
  document.querySelectorAll('.tag-btn-selectable').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('selected'));
  });

  // 3. Add Another Project Slot
  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
      addExtraProjectRow();
      showToast('Added extra project slot!', 'info');
    });
  }

  // 4. Resume Dropzone (Click + Drag & Drop)
  if (dropzone && resumeInput) {
    dropzone.addEventListener('click', () => resumeInput.click());

    resumeInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) setResumeFile(e.target.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--primary-blue)';
      dropzone.style.background = '#f0f7ff';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
      if (e.dataTransfer.files.length > 0) setResumeFile(e.dataTransfer.files[0]);
    });
  }

  // 5. Validation & Save before Step 3
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const projectName = projectNameInput.value.trim();
      const projectDesc = projectDescInput.value.trim();
      let isValid = true;

      clearFieldError(projectNameInput);
      clearFieldError(projectDescInput);

      if (projectName.length < 3) {
        setFieldError(projectNameInput, 'Project name must be at least 3 characters.');
        isValid = false;
      }
      if (projectDesc.length < 20) {
        setFieldError(projectDescInput, 'Please provide a project description of at least 20 characters.');
        isValid = false;
      }

      // Validate optional URL fields if non-empty
      const urlFields = [demoUrlInput, githubUrlInput, linkedinUrlInput, portfolioUrlInput, twitterUrlInput];
      urlFields.forEach(input => {
        if (!input) return;
        clearFieldError(input);
        const val = input.value.trim();
        if (val && !isValidUrl(val)) {
          setFieldError(input, 'URL must start with http:// or https://');
          isValid = false;
        }
      });

      const extraProjects = [];
      document.querySelectorAll('.extra-project-item').forEach(row => {
        const titleEl = row.querySelector('.extra-proj-title');
        const urlEl = row.querySelector('.extra-proj-url');
        const t = titleEl.value.trim();
        const u = urlEl.value.trim();
        clearFieldError(urlEl);
        if (u && !isValidUrl(u)) {
          setFieldError(urlEl, 'URL must start with http:// or https://');
          isValid = false;
        }
        if (t) extraProjects.push({ title: t, url: u });
      });

      if (!isValid) {
        showToast('Please fix the highlighted portfolio fields.', 'error');
        return;
      }

      const selectedTechs = Array.from(document.querySelectorAll('.tag-btn-selectable.selected'))
        .map(btn => btn.textContent.trim());

      saveProfile({
        featuredProject: {
          name: projectName,
          description: projectDesc,
          demoUrl: demoUrlInput.value.trim(),
          technologies: selectedTechs
        },
        extraProjects: extraProjects,
        links: {
          github: githubUrlInput.value.trim(),
          linkedin: linkedinUrlInput.value.trim(),
          website: portfolioUrlInput.value.trim(),
          twitter: twitterUrlInput.value.trim()
        },
        resumeFileName: uploadedResumeName
      });

      showToast('Portfolio & links saved! Moving to Final Step...', 'success');
      setTimeout(() => {
        window.location.href = 'profile-creation-step-3.html';
      }, 500);
    });
  }
});
